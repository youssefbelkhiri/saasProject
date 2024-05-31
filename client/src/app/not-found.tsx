import ErrorPage from './error/page';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error Page | Exam Generator",
  description: "This is Error Page for Exam Generator",
};


const NotFoundCatchAll = () => {
  return <ErrorPage />;
};

export default NotFoundCatchAll;
