import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:     { type: String, required: true, unique: true, trim: true },
    password:  { type: String, required: true, select: false },
    dateOfBirth: { type: Date, required: true },
    address: {
      street:  { type: String },
      city:    { type: String },
      state:   { type: String },
      country: { type: String, default: 'United States' },
      zipCode: { type: String },
    },
    kycStatus:  { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    kycDocuments: [
      {
        type:       { type: String },
        documentId: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    isActive:  { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil:   { type: Date },
    pin: { type: String, select: false },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret:  { type: String, select: false },
    profileImage: { type: String },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  if (this.isModified('pin') && this.pin) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.comparePin = async function (candidate) {
  return bcrypt.compare(candidate, this.pin);
};

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.set('toJSON', {
  virtuals: true,
  transform(_, obj) {
    delete obj.password;
    delete obj.pin;
    delete obj.twoFactorSecret;
    return obj;
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
