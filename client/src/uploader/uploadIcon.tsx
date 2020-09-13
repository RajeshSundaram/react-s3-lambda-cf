import React from "react";
import { FileUploadStatus } from ".";
import "./uploadIcon.css";

type UploadIconProps = {
  progress?: FileUploadStatus;
};
export const UploadIcon: React.FC<UploadIconProps> = ({
  progress = "set-in-motion",
}: UploadIconProps) => {
  const iconHtml = `<svg class="upload-box" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 17" version="1.1" xml:space="preserve" style="clip-rule:evenodd;fill-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41">
    <path id="upload-box" d="M26 3.82l3.16 1.18 -13.16 4.91 -13.16-4.91 3.16-1.18 0-3.07 -6 2.25 0 8 16 6 16-6 0-8 -6-2.25 0 3.07Z" fill="#63c6ee" />
  </svg>
  <svg class="upload-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="32" viewBox="0 0 16 16" version="1.1" xml:space="preserve" style="clip-rule:evenodd;fill-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41">
    <path id="upload-arrow" d="M6 16l4 0 0-8 6 0 -8-8 -8 8 6 0 0 8Z" fill="#63c6ee" />
  </svg>`;
  return (
    <div
      className={`upload-btn-container ${progress}`}
      dangerouslySetInnerHTML={{ __html: iconHtml }}
    ></div>
  );
};
