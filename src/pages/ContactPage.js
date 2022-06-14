import Heading from "components/layout/Heading";
import Layout from "components/layout/Layout";
import React, { useEffect } from "react";

const contactLinks = [
  {
    name: "Name",
    icon: <i className="fa fa-user-circle" aria-hidden="true"></i>,
    value: "Huỳnh Văn Long",
    to: "",
  },
  {
    name: "Email",
    icon: <i className="fa fa-envelope-o" aria-hidden="true"></i>,
    value: (
      <a href="mailto:longhuynhpyn01@gmail.com">longhuynhpyn01@gmail.com</a>
    ),
    to: "",
  },
  {
    name: "Facebook",
    icon: <i className="fa fa-facebook-official" aria-hidden="true"></i>,
    value: "fb.com/someone.worshipalove",
    to: "https://www.facebook.com/someone.worshipalove",
  },
  {
    name: "Github",
    icon: <i className="fa fa-github" aria-hidden="true"></i>,
    value: "github.com/longhuynhpyn01",
    to: "https://www.github.com/longhuynhpyn01",
  },
];

const ContactPage = () => {
  useEffect(() => {
    document.title = "Monkey Blogging - Contact";
  }, []);

  return (
    <Layout>
      <div className="container">
        <div className="p-5 md:p-10 mt-10 mb-5 max-w-full w-[600px] shadow-type1 rounded-xl mx-auto">
          <Heading>Contact Infomation</Heading>
          {contactLinks.map((link) => {
            if (link.to) {
              const handleClick = (url) => {
                window.open(url);
              };

              return (
                <div
                  className="flex items-center gap-4 p-4 font-medium"
                  key={link.name}
                >
                  <span className="menu-icon">{link.icon}</span>
                  <span className="menu-text">
                    {`${link.name}: `}
                    <span
                      className="cursor-pointer"
                      onClick={() => handleClick(link.to)}
                    >
                      {link.value}
                    </span>
                  </span>
                </div>
              );
            }

            return (
              <div
                className="flex items-center gap-4 p-4 font-medium"
                key={link.name}
              >
                <span className="menu-icon">{link.icon}</span>
                <span className="menu-text">
                  {`${link.name}: `}
                  {link.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
