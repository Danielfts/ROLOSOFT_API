import dns from "dns/promises";

export async function isValidEmail(email: string): Promise<boolean> {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return false;

  const domain = email.split("@")[1];
  try {
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED'){
      console.error("Whoops, you aren't conected to the internet! No worries, this is a toy application, so I dont care!")
      return true;
    }
    console.error(`Error resolving MX records for domain ${domain}:`, error);
    return false;
  }
}
