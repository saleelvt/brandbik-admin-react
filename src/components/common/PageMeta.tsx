import { HelmetProvider, Helmet } from "react-helmet-async";


const PageMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Helmet>
    <title>{title ? `${title} | Scitor Admin Dashboard` : 'Scitor Admin Dashboard'}</title>
    <meta name="description" content={description || 'Scitor Admin Dashboard for managing your business efficiently.'} />
    <meta name="keywords" content="Scitor, Admin, Dashboard, Management, Analytics, React, Tailwind" />
    <meta name="author" content="Scitor Team" />
    <meta property="og:title" content={title ? `${title} | Scitor Admin Dashboard` : 'Scitor Admin Dashboard'} />
    <meta property="og:description" content={description || 'Scitor Admin Dashboard for managing your business efficiently.'} />
    <meta property="og:image" content="/scitor-logo.png" />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/png" href="/scitor-logo.png" />
    <link rel="apple-touch-icon" href="/scitor-logo.png" />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
