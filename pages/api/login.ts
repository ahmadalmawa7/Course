import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

type Data = { success: boolean; message: string; user?: any };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'email and password are required' });
  }

  const { db } = await connectToDatabase();
  const users = db.collection('users');

  const user = await users.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const { password: _pwd, ...rawUser } = user as any;
  const userWithoutPassword = {
    enrolledCourses: [],
    completedCourses: [],
    progress: {},
    certificates: [],
    ...rawUser,
  };

  return res.status(200).json({ success: true, message: 'Login successful', user: userWithoutPassword });
}
