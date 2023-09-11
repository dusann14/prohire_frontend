import React from "react";
import Application from "./Application";

function ApplicationList({ applications, showUserDetails }) {
  return (
    <section className="jobList">
      <div className="container">
        <div className="jobList-content grid">
          {applications.map((item) => {
            return (
              <Application
                application={item}
                showUserDetails={showUserDetails}
                key={item.id}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ApplicationList;
