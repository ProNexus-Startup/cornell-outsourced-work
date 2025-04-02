/*import apiService from "./api";
import { defaultProject, projectFromJson } from "@/models/project";
import { expertNetworkRelationshipFromJson } from "@/models/expert_network_relationship";
import IndexedDBService from "./idb";
import ProjectState from "./persistence/project_storage";
import { profileTypeFromJson } from "@/models/profile_type";
import { otherPromptFromJson } from "@/models/other_prompt";
import { subProfileTypeFromJson } from "@/models/sub_profile_type";
import UserState from "./persistence/user_storage";
import { UserAnalytic } from "@/models/user_analytic";
import { v4 as uuidv4 } from "uuid";

/**
 * Updates the corresponding IDB store based on the API action and endpoint.
 * Assumes that `data.id` holds the identifier of the record to update or delete.
 *
 * @param action - The API action: 'make', 'update', or 'delete'
 * @param endpoint - The API endpoint (used to decide which store to update)
 * @param data - The data sent in the request (used for deletion, if needed)
 * @param responseData - The data returned from the API (for make/update)
 
export async function updateLocalDBAfterRequest(
  action: string,
  endpoint: string,
  data: any
): Promise<void> {
  const lowerAction = action.toLowerCase();

  // Get a handle on the IDB database instance.
  // (This uses the fact that IndexedDBService.instance returns an IDBPDatabase.)
  const db = IndexedDBService.instance;
  let project = defaultProject();

  switch (endpoint) {
    case "user":
      if (lowerAction === "delete") {
        await db.delete("userProfiles", data.id);
      } else {
        const user = data;
        await IndexedDBService.updateUser(user);
      }
      break;
    case "join":
      if (lowerAction === "delete") {
        await db.delete("userProfiles", data.id);
      } else {
        const user = data;
        await IndexedDBService.updateUser(user);
      }
      break;

    case "project":
      if (lowerAction === "delete") {
        await db.delete("projects", data.id);
      } else {
        const project = data;
        await IndexedDBService.updateProject(project);
      }
    case "project-question":
      project = await ProjectState.getInstance().getCurrentProject();
      if (lowerAction === "delete") {
        project.projectQuestions = project.projectQuestions.filter(
          (question) => question.id !== data.id
        );
        await IndexedDBService.updateProject(project);
      } else {
        const questionIndex = project.projectQuestions.findIndex(
          (question) => question.id === data.id
        );
        if (questionIndex !== -1) {
          project.projectQuestions[questionIndex] = data;
        } else {
          project.projectQuestions.push(data);
        }
        await IndexedDBService.updateProject(project);
      }
      break;
    case "colleague":
      // Handle project colleagues
      project = await ProjectState.getInstance().getCurrentProject();
      if (lowerAction === "delete") {
        project.colleagues = project.colleagues.filter(
          (colleague) => colleague.id !== data.id
        );
        await IndexedDBService.updateProject(project);
      } else {
        const colleagueIndex = project.colleagues.findIndex(
          (colleague) => colleague.id === data.id
        );
        if (colleagueIndex !== -1) {
          project.colleagues[colleagueIndex] = data;
        } else {
          project.colleagues.push(data);
        }
        await IndexedDBService.updateProject(project);
      }

      // Handle user projects
      const user = UserState.getInstance().getUserProfile();
      if (lowerAction === "delete") {
        user.userProjects = user.userProjects.filter(
          (project) => project.id !== data.id
        );
        await IndexedDBService.updateUser(user);
      } else {
        const userProjectIndex = user.userProjects.findIndex(
          (project) => project.id === data.id
        );
        if (userProjectIndex !== -1) {
          user.userProjects[userProjectIndex] = data;
        } else {
          user.userProjects.push(data);
        }
        await IndexedDBService.updateUser(user);
      }
      break;
    case "expenses":
      project = await ProjectState.getInstance().getCurrentProject();
      if (lowerAction === "delete") {
        project.expenses = project.expenses.filter(
          (expense) => expense.id !== data.id
        );
        await IndexedDBService.updateProject(project);
      } else {
        const expenseIndex = project.expenses.findIndex(
          (expense) => expense.id === data.id
        );
        if (expenseIndex !== -1) {
          project.expenses[expenseIndex] = data;
        } else {
          project.expenses.push(data);
        }
        await IndexedDBService.updateProject(project);
      }
      break;
    case "profile-type":
      project = await ProjectState.getInstance().getCurrentProject();
      if (lowerAction === "delete") {
        project.profileTypes = project.profileTypes.filter(
          (type) => type.id !== data.id
        );
        if (project.profileTypes) {
          project.profileTypes.forEach((profileType) => {
            if (profileType.otherPrompts) {
              profileType.otherPrompts = profileType.otherPrompts.filter(
                (prompt) => prompt.profileTypeId !== data.id
              );
            }
          });
        }
      } else {
        const updatedProfileType = profileTypeFromJson(
          data,
          project.profileTypes?.flatMap((pt) => pt.otherPrompts || [])
        );
        const typeIndex = project.profileTypes?.findIndex(
          (type) => type.id === data.id
        );

        if (typeIndex !== -1) {
          project.profileTypes[typeIndex] = updatedProfileType;
        } else {
          project.profileTypes.push(updatedProfileType);
        }
      }
      await IndexedDBService.updateProject(project);
      break;
    case "other-prompt":
      project = await ProjectState.getInstance().getCurrentProject();
      if (lowerAction === "delete") {
        if (project.profileTypes) {
          project.profileTypes.forEach((profileType) => {
            if (profileType.otherPrompts) {
              profileType.otherPrompts = profileType.otherPrompts.filter(
                (prompt) => prompt.id !== data.id
              );
            }
          });
        }
      } else {
        const updatedPrompt = otherPromptFromJson(data);

        const profileTypeIndex = project.profileTypes?.findIndex(
          (profileType) => profileType.id === updatedPrompt.profileTypeId
        );

        if (profileTypeIndex !== -1 && project.profileTypes) {
          const profileType = project.profileTypes[profileTypeIndex];
          if (!profileType.otherPrompts) {
            profileType.otherPrompts = [];
          }

          const promptIndex = profileType.otherPrompts.findIndex(
            (prompt) => prompt.id === updatedPrompt.id
          );

          if (promptIndex !== -1) {
            profileType.otherPrompts[promptIndex] = updatedPrompt;
          } else {
            profileType.otherPrompts.push(updatedPrompt);
          }
        }
      }
      await IndexedDBService.updateProject(project);
      break;
    case "sub-profile-type":
      project = await ProjectState.getInstance().getCurrentProject();
      if (lowerAction === "delete") {
        if (project.profileTypes) {
          project.profileTypes.forEach((profileType) => {
            if (profileType.subProfileTypes) {
              profileType.subProfileTypes = profileType.subProfileTypes.filter(
                (subProfileType) => subProfileType.id !== data.id
              );
            }
          });
        }
      } else {
        const updatedSubProfileType = subProfileTypeFromJson(data);

        const profileTypeIndex = project.profileTypes?.findIndex(
          (profileType) =>
            profileType.id === updatedSubProfileType.profileTypeId
        );

        if (profileTypeIndex !== -1 && project.profileTypes) {
          const profileType = project.profileTypes[profileTypeIndex];
          if (!profileType.subProfileTypes) {
            profileType.subProfileTypes = [];
          }

          const subProfileTypeIndex = profileType.subProfileTypes.findIndex(
            (subProfileType) => subProfileType.id === updatedSubProfileType.id
          );

          if (subProfileTypeIndex !== -1) {
            profileType.subProfileTypes[subProfileTypeIndex] =
              updatedSubProfileType;
          } else {
            profileType.subProfileTypes.push(updatedSubProfileType);
          }
        }
      }
      await IndexedDBService.updateProject(project);
      break;

    case "column-preference":
      project = await ProjectState.getInstance().getCurrentProject();
      if (lowerAction === "delete") {
        project.columnPreferences = project.columnPreferences.filter(
          (pref) => pref.id !== data.id
        );
        await IndexedDBService.updateProject(project);
      } else {
        const prefIndex = project.columnPreferences.findIndex(
          (pref) => pref.id === data.id
        );
        if (prefIndex !== -1) {
          project.columnPreferences[prefIndex] = data;
        } else {
          project.columnPreferences.push(data);
        }
        await IndexedDBService.updateProject(project);
      }
      break;

    case "filter":
      project = await ProjectState.getInstance().getCurrentProject();
      if (lowerAction === "delete") {
        project.filters = project.filters.filter(
          (filter) => filter.id !== data.id
        );
        await IndexedDBService.updateProject(project);
      } else {
        const filterIndex = project.filters.findIndex(
          (filter) => filter.id === data.id
        );
        if (filterIndex !== -1) {
          project.filters[filterIndex] = data;
        } else {
          project.filters.push(data);
        }
        await IndexedDBService.updateProject(project);
      }
      break;

    case "project-email":
      project = await ProjectState.getInstance().getCurrentProject();
      if (lowerAction === "delete") {
        project.projectEmails = project.projectEmails.filter(
          (email) => email.id !== data.id
        );
        await IndexedDBService.updateProject(project);
      } else {
        const emailIndex = project.projectEmails.findIndex(
          (email) => email.id === data.id
        );
        if (emailIndex !== -1) {
          project.projectEmails[emailIndex] = data;
        } else {
          project.projectEmails.push(data);
        }
        await IndexedDBService.updateProject(project);
      }
      break;
    case "status":
      project = await ProjectState.getInstance().getCurrentProject();
      if (lowerAction === "delete") {
        project.statuses = project.statuses.filter(
          (status) => status.id !== data.id
        );
        await IndexedDBService.updateProject(project);
      } else {
        const statusIndex = project.statuses.findIndex(
          (status) => status.id === data.id
        );
        if (statusIndex !== -1) {
          project.statuses[statusIndex] = data;
        } else {
          project.statuses.push(data);
        }
        await IndexedDBService.updateProject(project);
      }
      break;
    case "goal":
      project = await ProjectState.getInstance().getCurrentProject();
      if (lowerAction === "delete") {
        project.goals = project.goals.filter((goal) => goal.id !== data.id);
        await IndexedDBService.updateProject(project);
      } else {
        const goalIndex = project.goals.findIndex(
          (goal) => goal.id === data.id
        );
        if (goalIndex !== -1) {
          project.goals[goalIndex] = data;
        } else {
          project.goals.push(data);
        }
        await IndexedDBService.updateProject(project);
      }
      break;
    case "expert":
      if (lowerAction === "delete") {
        await db.delete("experts", data.id);
      } else {
        const expert = data;
        await IndexedDBService.updateExpert(expert);
      }
      break;
    case "cost":
      if (lowerAction === "delete") {
        await db.delete("expertNetworkRelationships", data.id);
      } else {
        const cost = data;
        await db.put("expertNetworkRelationships", cost);
      }
      break;
    case "expert-question":
      const experts = await IndexedDBService.getAllExperts();
      const expert = experts.find((expert) => expert.id === data.expertId);
      if (lowerAction === "delete") {
        expert.questions = expert.questions.filter(
          (question) => question.id !== data.id
        );
        await IndexedDBService.updateExpert(expert);
      } else {
        const questionIndex = expert.questions.findIndex(
          (question) => question.id === data.id
        );
        if (questionIndex !== -1) {
          expert.questions[questionIndex] = data;
        } else {
          expert.questions.push(data);
        }
        await IndexedDBService.updateExpert(expert);
      }
      break;

    case "availability":
    case "add-or-update-availability":
      const expertsForAvail = await IndexedDBService.getAllExperts();
      const expertForAvail = expertsForAvail.find(
        (expert) => expert.id === data.expertId
      );
      if (lowerAction === "delete") {
        expertForAvail.availabilities = expertForAvail.availabilities.filter(
          (availability) => availability.id !== data.id
        );
        await IndexedDBService.updateExpert(expertForAvail);
      } else {
        const availabilityIndex = expertForAvail.availabilities.findIndex(
          (availability) => availability.id === data.id
        );
        if (availabilityIndex !== -1) {
          expertForAvail.availabilities[availabilityIndex] = data;
        } else {
          expertForAvail.availabilities.push(data);
        }
        await IndexedDBService.updateExpert(expertForAvail);
      }
      break;
    case "job":
      const expertsForJob = await IndexedDBService.getAllExperts();
      const expertForJob = expertsForJob.find(
        (expert) => expert.id === data.expertId
      );
      if (lowerAction === "delete") {
        expertForJob.jobs = expertForJob.jobs.filter(
          (job) => job.id !== data.id
        );
        await IndexedDBService.updateExpert(expertForJob);
      } else {
        const jobIndex = expertForJob.jobs.findIndex(
          (job) => job.id === data.id
        );
        if (jobIndex !== -1) {
          expertForJob.jobs[jobIndex] = data;
        } else {
          expertForJob.jobs.push(data);
        }
        await IndexedDBService.updateExpert(expertForJob);
      }
      break;
    case "comment":
      const expertsForComment = await IndexedDBService.getAllExperts();
      const expertForComment = expertsForComment.find(
        (expert) => expert.id === data.expertId
      );
      if (lowerAction === "delete") {
        expertForComment.comments = expertForComment.comments.filter(
          (comment) => comment.id !== data.id
        );
        await IndexedDBService.updateExpert(expertForComment);
      } else {
        const commentIndex = expertForComment.comments.findIndex(
          (comment) => comment.id === data.id
        );
        if (commentIndex !== -1) {
          expertForComment.comments[commentIndex] = data;
        } else {
          expertForComment.comments.push(data);
        }
        await IndexedDBService.updateExpert(expertForComment);
      }
      break;
    default:
      console.warn(
        `No local DB update logic defined for endpoint: ${endpoint}`
      );
  }
}

/**
 * Wraps the generalPurposeRequest so that, after a successful make/update/delete request,
 * the local IndexedDB is updated accordingly.
 *
 * @param action - 'make', 'update', 'delete' (GET requests are not handled here)
 * @param endpoint - The API endpoint to call
 * @param data - The request payload (must include an id for delete operations)
 * @param useToken - Whether to use the stored authentication token
 * @param subdomain - The subdomain to use (if applicable)
 * @param usePython - Whether to call the Python backend (default: false)
 * @returns The API Response (or null if the request failed)
 
export async function generalPurposeRequestWithLocalUpdate(
  action: string,
  endpoint: string,
  data: any
): Promise<Response | null> {
  // First, call the original general purpose API request.
  const response = await apiService.generalPurposeRequest(
    action,
    endpoint,
    data
  );
  const userState = UserState.getInstance();
  const currentUser = userState.getUserProfile();

  const userAnalytic: UserAnalytic = {
    id: uuidv4(),
    userProfileId: currentUser?.id ?? "anonymous",
    ipAddress: window.location.hostname,
    actionTime: new Date(),
    actionType: action,
    fromPage: null,
    toPage: endpoint,
  };

  apiService.generalPurposeRequest("make", "analytic", userAnalytic);

  if (!response) {
    console.error("API request failed; skipping local DB update.");
    return null;
  }

  // For GET requests, no local DB update is needed.
  if (action.toLowerCase() !== "get" && response.ok) {
    try {
      await updateLocalDBAfterRequest(action, endpoint, data);
    } catch (error) {
      console.error("Error updating local DB:", error);
    }
  }

  return response;
}
*/