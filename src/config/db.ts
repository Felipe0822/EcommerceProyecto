import { Pool } from "pg";

export const pool = new Pool({
    host: "aws-1-us-east-1.pooler.supabase.com",
    port: 6543,
    user: "postgres.ydotvysbhsjludcezymt",
    password: "felilolxd0822",
    database: "techstore"
});