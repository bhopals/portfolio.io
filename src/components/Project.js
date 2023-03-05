import { Fragment, useContext } from "react";
import { ga, languageColor, skeleton } from "../helpers/utils";
import { AiOutlineStar, AiOutlineFork } from "react-icons/ai";
import config from "../config";
import PropTypes from "prop-types";
import { LoadingContext } from "../contexts/LoadingContext";
import axios from "axios";

const Project = (props) => {
  const [loading] = useContext(LoadingContext);

  const fetchRepoDetails = async (owner, repo) => {
    const repoDetails = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    return repoDetails.data;
  };

  const renderSkeleton = () => {
    let array = [];
    for (let index = 0; index < config.github.limit; index++) {
      array.push(
        <div className="card shadow-lg compact bg-base-100" key={index}>
          <div className="flex justify-between flex-col p-8 h-full w-full">
            <div>
              <div className="flex items-center">
                <span>
                  <h5 className="card-title text-lg">
                    {skeleton({ width: "w-32", height: "h-8" })}
                  </h5>
                </span>
              </div>
              <div className="mb-5 mt-1">
                {skeleton({
                  width: "w-full",
                  height: "h-4",
                  className: "mb-2",
                })}
                {skeleton({ width: "w-full", height: "h-4" })}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-grow">
                <span className="mr-3 flex items-center">
                  {skeleton({ width: "w-12", height: "h-4" })}
                </span>
                <span className="flex items-center">
                  {skeleton({ width: "w-12", height: "h-4" })}
                </span>
              </div>
              <div>
                <span className="flex items-center">
                  {skeleton({ width: "w-12", height: "h-4" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return array;
  };

  const renderProjects = () => {
    return props.repo.map((item, index) => (
      <div
        className="card shadow-lg compact bg-base-100 cursor-pointer"
        key={index}
        onClick={() => {
          try {
            if (config.googleAnalytics && config.googleAnalytics.id) {
              ga.event({
                action: "Click project",
                params: {
                  project: item.repo,
                },
              });
            }
          } catch (error) {
            console.error(error);
          }
          window.open(item.clone_url, "_blank");
        }}
      >
        <div className="flex justify-between flex-col p-8 h-full w-full">
          <div>
            <div className="flex items-center opacity-60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 mr-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              <span>
                <h5 className="card-title text-lg">{item.name}</h5>
              </span>
            </div>
            <p className="mb-5 mt-1 text-base-content text-opacity-60 text-sm">
              {item.description}
            </p>
          </div>
          <div>
            <div className="flex items-center opacity-60">
              <span>
                <h5 className="card-title text-lg">
                  <b>Demo -</b>&nbsp;&nbsp;
                  <a target="_blank" href={item.homepage}>
                    {item.homepage}
                  </a>
                </h5>
                <br />
                <h5 className="card-title text-lg">
                  {item.topics.map((skill, index) => (
                    <div
                      key={index}
                      className="m-1 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 badge-primary bg-opacity-75 rounded-full"
                    >
                      {skill}
                    </div>
                  ))}
                </h5>
              </span>
            </div>
          </div>
          <div className="flex justify-between text-sm text-base-content text-opacity-60">
            <div className="flex flex-grow">
              <span className="mr-3 flex items-center">
                <AiOutlineStar className="mr-0.5" />
                <span>{item.stargazers_count}</span>
              </span>
              <span className="flex items-center">
                <AiOutlineFork className="mr-0.5" />
                <span>{item.forks}</span>
              </span>
            </div>
            <div>
              <span className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-1 opacity-60"
                  style={{ backgroundColor: languageColor(item.language) }}
                />
                <span>{item.language}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <Fragment>
      <div className="col-span-1 lg:col-span-2">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <div className="card compact bg-base-100 shadow-sm">
              <div className="card-body">
                <ul className="menu row-span-3 bg-base-100 text-base-content">
                  <li>
                    <div className="pb-0-important mx-4 flex items-center justify-between">
                      <h5 className="card-title">
                        {loading ? (
                          skeleton({ width: "w-28", height: "h-8" })
                        ) : (
                          <span className="opacity-70">My Projects</span>
                        )}
                      </h5>
                      {loading ? (
                        skeleton({ width: "w-10", height: "h-5" })
                      ) : (
                        <a
                          href={`https://github.com/${config.github.username}?tab=repositories`}
                          target="_blank"
                          rel="noreferrer"
                          className="opacity-50"
                        >
                          See All
                        </a>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading || !props.repo ? renderSkeleton() : renderProjects()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Project.propTypes = {
  repo: PropTypes.array,
};

export default Project;
