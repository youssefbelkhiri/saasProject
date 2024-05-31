import ErrorPage from './error/page';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error Page | Free Next.js Template for Startup and SaaS",
  description: "This is Error Page for Startup Nextjs Template",
};


const NotFoundCatchAll = () => {
  return <ErrorPage />;
};

export default NotFoundCatchAll;
