import React from "react";
import Job from "./Job";

function JobList({ jobs }) {
  return (
    <section className="jobList" style={{ paddingTop: "40px" }}>
      <div className="container">
        <div className="jobList-content grid">
          {jobs.map((item) => {
            return <Job job={item} key={item.id} />;
          })}
        </div>
      </div>
    </section>
  );
}

export default JobList;
