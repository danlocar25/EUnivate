import React from "react";
import { Link } from 'react-router-dom';
import { 
    dashboard_logo, 
    dashboard_sidenav_icon, 
    project_red, 
    task_red,
    messages_red, 
    settings_red, 
    activity_red,
    people_red,
    project_icon,
    task_icon,
    messages_icon,
    settings_icon,
    activity_icon,
    people_icon
} from "../../../constants/assets";

const Guess_Layout = ({ isNavOpen }) => {
    return (
        <div
            className={`side-nav-admin fixed top-0 left-0 h-full bg-red-750 shadow-lg transition-transform transform ${
                isNavOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 lg:w-[250px] z-30`}
        >
            <div className="dashboard-logo flex items-center p-4">
                <img
                    src={dashboard_logo}
                    alt="EUnivate Logo"
                    className="h-7 mr-3"
                />
                <h2 className="text-lg font-bold text-white mt-3">EUnivate</h2>
            </div>

            <ul className="list-none p-0">
                {[
{
    to: "project-guest", text: "Project", icon: project_icon, hoverIcon: project_red
},
{
    to: "task-guest", text: "Task", icon: task_icon, hoverIcon: task_red
},
{
    to: "activity-guest", text: "Activity", icon: activity_icon, hoverIcon: activity_red
},
{
    to: "messages-guest", text: "Messages", icon: messages_icon, hoverIcon: messages_red
},
{
    to: "settings-guest", text: "Settings", icon: settings_icon, hoverIcon: settings_red
}

            ].map((item, index) => (
                    <li className="mb-2" key={index}>
                        <Link
                            to={item.to}
                            className="group relative flex items-center p-2 bg-red-750 hover:bg-red-700 rounded-md transition-all"
                        >
                            <img
                                src={item.icon}
                                alt={`${item.text} Icon`}
                                className="absolute h-5 group-hover:hidden"
                            />
                            <img
                                src={item.hoverIcon}
                                alt={`${item.text} Icon Red`}
                                className="absolute h-5 hidden group-hover:block -translate-y-1"
                            />
                            <span className="ml-10 text-red-750 group-hover:text-red-750">
                                {item.text}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Guess_Layout;
