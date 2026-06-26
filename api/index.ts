import handler from '../dist/src/serverless';
console.log("DEPLOYMENT CHECK");
console.log("COMMIT:", process.env.VERCEL_GIT_COMMIT_SHA);
console.log("BUILD:", new Date().toISOString());
console.log(require("@prisma/client/package.json").version);
export default handler;
