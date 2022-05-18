import React from "react";

const Field = React.forwardRef(({label, type}, ref) => {
    return (
      <>
        {/* <label>{label}</label> */}
        <input ref={ref} type={type} placeholder={label} />
      </>
    );
  });

export default Field