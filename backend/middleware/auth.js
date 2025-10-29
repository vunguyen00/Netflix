import jwt from 'jsonwebtoken';

/**
 * Middleware bình thường cho user
 * Nếu NODE_ENV=development, sẽ tự gán req.user = { id: 'dev' }
 */
export function authenticate(req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    req.user = { id: 'dev' }; // dev mode: bỏ qua token
    return next();
  }

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token && req.query.token) {
    token = req.query.token;
  }
  if (!token) return res.status(401).json({ message: 'Không có token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('authenticate: token verify error ->', err.message);
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
}

/**
 * Middleware admin
 */
export function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không có token' });

  const secrets = [process.env.JWT_SECRET, process.env.JWT_SECRET + '_ADMIN'];
  let decoded = null;
  let lastError = null;

  for (const secret of secrets) {
    try {
      decoded = jwt.verify(token, secret);
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!decoded) return res.status(401).json({ message: 'Token không hợp lệ' });
  if (!decoded.role) return res.status(403).json({ message: 'Không có quyền' });

  req.admin = decoded;
  next();
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.admin) return res.status(401).json({ message: 'Không có token' });
    if (!roles.includes(req.admin.role)) return res.status(403).json({ message: 'Không có quyền' });
    next();
  };
}
