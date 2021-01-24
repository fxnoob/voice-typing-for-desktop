import React, { useState } from "react";
import Alert from "@material-ui/lab/Alert";
import db from "../services/db";
import helpImage from "./helpImage.png";
import i18nService from "../services/i18nService";

const Permissions = () => {
  const SUCCESS_MSG = i18nService.getMessage('audio_permission_success_msg');
  const ERROR_MSG = i18nService.getMessage('audio_permission_error_msg');
  const [message, setMessage] = useState("");
  const allowPermissions = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(async stream => {
        setMessage(SUCCESS_MSG);
        await db.set({ audioAccess: true });
        stream.getTracks().forEach(track => {
          track.stop();
          window.reload();
        });
      })
      .catch(async () => {
        await db.set({ audioAccess: false });
        setMessage(ERROR_MSG);
      });
  };

  const GetMessage = ({ message }) => {
    let component = "";
    if (message == SUCCESS_MSG) {
      component = <Alert>{message}</Alert>;
    } else if (message == ERROR_MSG) {
      component = <Alert severity="error">{message}</Alert>;
    }
    return component;
  };

  return (
    <div>
      <div className="bg-white align-center" style={{ textAlign: "center" }}>
        <div style={{ maxWidth: '40rem' }} className=" mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          {/* eslint-disable-next-line max-len */}
          <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
            {i18nService.getMessage('audio_permission_todo_label')}
          </h2>
          <div className="mt-8 flex justify-center">
            <div className="ml-3 inline-flex">
              <button
                aria-label="click here to allow audio permissions"
                data-balloon-pos="down"
                onClick={allowPermissions}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:shadow-outline focus:border-indigo-300 transition duration-150 ease-in-out btn"
              >
                {i18nService.getMessage('allow_permission_label')}
              </button>
            </div>
          </div>
          <p
            className="mt-8 text-2xl"
          >
            <GetMessage message={message} />
          </p>
          <hr/>
          <p className="mt-8 text-2xl">
            {i18nService.getMessage('audio_permission_notice_info')}
          </p>
          {message == ERROR_MSG &&
            <p
              style={{
                marginTop: "0.5rem",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <img src={helpImage} />
            </p>
          }
        </div>
      </div>
    </div>
  );
};
export default Permissions;
