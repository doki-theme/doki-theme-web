import React, { FC } from "react";
import { Field, FieldAttributes } from "formik";
import omit from "lodash/omit";

const DokiRadioButton: FC<FieldAttributes<any>> = (props) => {
  return (
    <label className={"radio-container"}>
      <Field {...omit(props, ["children"])} />
      <span className={"checkmark"}>
        <svg
          width="16px"
          height="16px"
          version="1.1"
          viewBox="0 0 2.1266 2.1266"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(-101.75 -116.78)">
            <path
              d="m102.81 117.26c0.0448-0.0246 0.19603-0.12429 0.41693-0.17473 0.5093-0.1163 0.70508 0.44524 0.40475 0.86866-0.2683 0.30809-0.54679 0.44962-0.82168 0.63191-0.27488-0.18229-0.55338-0.32382-0.82168-0.63191-0.30032-0.42342-0.10454-0.98496 0.40476-0.86866 0.2209 0.0504 0.37208 0.1501 0.41692 0.17473"
              fill={"currentColor"}
            />
          </g>
        </svg>
      </span>
      {props.children}
    </label>
  );
};

export default DokiRadioButton;
