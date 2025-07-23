import { blink } from '../blink/client'

// Simple admin credentials for demo purposes
const ADMIN_CREDENTIALS = {
  email: 'admin@tadcs.in',
  password: 'admin123'
}

export const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await blink.db.adminUsers.list({
      where: { email: ADMIN_CREDENTIALS.email },
      limit: 1
    })

    if (existingAdmin.length === 0) {
      // Create admin user
      await blink.db.adminUsers.create({
        id: 'admin_001',
        userId: 'admin_user_001',
        email: ADMIN_CREDENTIALS.email,
        name: 'System Administrator',
        role: 'admin'
      })
      console.log('Admin user created successfully')
    }
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

export const validateAdminCredentials = (email: string, password: string): boolean => {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password
}

export const getAdminCredentials = () => ADMIN_CREDENTIALS