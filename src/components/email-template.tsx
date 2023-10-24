import * as React from "react";

interface EmailTemplateProps {
  host: string;
  url: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  host,
  url,
}) => (
  <div>
    <h1>Welcome!</h1>
    <p>
      Sign in to &nbsp;
      <span>
        <a href={url}>{host}</a>
      </span>
    </p>
  </div>
);
