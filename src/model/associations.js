// A.belongsTo(B) association means One-To-One
// A.hasOne(B) association means One-To-One
// A.hasMany(B) association means One-To-Many
// A.belongsToMany(B, { through: 'C' }) association means Many-To-Many relationship, using table C as junction table

import { User } from "./user.js";
