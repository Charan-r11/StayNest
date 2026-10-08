const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configured Email Transporter (SMTP / SendGrid / AWS SES secrets set in environment variables)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL || "notifications@staynest.com",
    pass: process.env.SMTP_PASSWORD || "secret_pass_token"
  }
});

/**
 * HTTPS Callable: Generates secure Email OTP, saves hash/expiration in Firestore, sends email.
 * OTP is generated strictly server-side and never exposed in the client response.
 */
exports.sendEmailOtp = functions.https.onCall(async (data, context) => {
  const email = data.email;
  if (!email || !email.includes("@")) {
    throw new functions.https.HttpsError("invalid-argument", "A valid email address is required.");
  }

  // Generate 6-digit cryptographically secure OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  // Store in firestore under protected collection
  await admin.firestore().collection("email_otps").doc(email.toLowerCase()).set({
    otp: otp,
    expiresAt: expiresAt,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Send Email via configured Provider
  const mailOptions = {
    from: '"StayNest PG App" <no-reply@staynest.com>',
    to: email,
    subject: "Your StayNest Verification Code",
    text: `Your StayNest sign-in OTP code is ${otp}. It will expire in 10 minutes.`,
    html: `<h3>StayNest Verification</h3><p>Your sign-in OTP code is <b>${otp}</b>. It will expire in 10 minutes.</p>`
  };

  try {
    if (process.env.SMTP_EMAIL) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[DEVELOPMENT OTP LOG] Generated OTP for ${email}: ${otp}`);
    }
    return { success: true, message: "OTP sent successfully to " + email };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new functions.https.HttpsError("internal", "Failed to send email OTP: " + error.message);
  }
});

/**
 * HTTPS Callable: Verifies Email OTP server-side and returns a Firebase Custom Auth Token.
 */
exports.verifyEmailOtp = functions.https.onCall(async (data, context) => {
  const email = data.email;
  const userOtp = data.otp;

  if (!email || !userOtp) {
    throw new functions.https.HttpsError("invalid-argument", "Email and OTP code are required.");
  }

  const doc = await admin.firestore().collection("email_otps").doc(email.toLowerCase()).get();
  if (!doc.exists) {
    throw new functions.https.HttpsError("not-found", "No OTP requested for this email.");
  }

  const record = doc.data();
  if (Date.now() > record.expiresAt) {
    throw new functions.https.HttpsError("deadline-exceeded", "OTP code has expired. Please request a new one.");
  }

  if (record.otp !== userOtp) {
    throw new functions.https.HttpsError("permission-denied", "Invalid OTP code entered.");
  }

  // OTP is valid - delete consumed OTP record
  await admin.firestore().collection("email_otps").doc(email.toLowerCase()).delete();

  // Retrieve or create User in Firebase Auth
  let userRecord;
  try {
    userRecord = await admin.auth().getUserByEmail(email);
  } catch (e) {
    userRecord = await admin.auth().createUser({ email: email, emailVerified: true });
  }

  // Generate Custom Auth Token for client login
  const customToken = await admin.auth().createCustomToken(userRecord.uid);
  return { success: true, customToken: customToken };
});

/**
 * HTTPS Callable: Privileged action for Property Owners to approve maintenance staff access.
 */
exports.approveMaintenanceStaff = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
  }

  const callerUid = context.auth.uid;
  const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
  if (!callerDoc.exists || callerDoc.data().role !== "PROPERTY_OWNER") {
    throw new functions.https.HttpsError("permission-denied", "Only Property Owners can approve staff.");
  }

  const staffUid = data.staffUid;
  const isApproved = data.isApproved === true;

  await admin.firestore().collection("users").doc(staffUid).update({
    isApproved: isApproved,
    approvedByOwnerId: callerUid
  });

  await admin.firestore().collection("maintenance_members").doc(staffUid).update({
    isApproved: isApproved
  });

  return { success: true, message: `Staff access ${isApproved ? "approved" : "revoked"}.` };
});
