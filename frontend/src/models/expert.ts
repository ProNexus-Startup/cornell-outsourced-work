import { getStatusColor } from "@/components/expert-profile/summary/StatusSection";
import { Availability, availabilityFromJson } from "./availability";
import { Comment, commentFromJson } from "./comment";
import { ExpertNetworkRelationship } from "./expert_network_relationship";
import { ExpertQuestion, expertQuestionFromJson } from "./expert_question";
import { Job, jobFromJson } from "./job";
import { Project } from "./project";
import {
  AIAssessmentScore,
  aiAssessmentScoreFromJson,
} from "./ai_assessment_score";

export interface Expert {
  id: string;
  name?: string | null;
  organizationId?: string | null;
  projectId?: string | null;
  favorite: boolean;
  selected?: boolean;
  profession?: string | null;
  company?: string | null;
  departureTime?: string | null;
  description?: string | null;
  geography?: string | null;
  profileTypeId?: string | null;
  status?: string | null;
  internalStatus?: string | null;
  onStatusChange?: (expert: Expert, newStatus: string) => Promise<void>;
  aiAssessment?: number | null;
  aiAnalysis?: string | null;
  aiRationale?: string | null;
  aiMatchValue?: number | null;
  expertNetworkName?: string | null;
  cost?: number | null;
  currency?: string | null;
  addedExpertById?: string | null;
  dateAddedExpert?: Date | null; // ISO string
  profileTypeName?: string | null;
  addedCallById?: string | null;
  dateAddedCall?: Date | null; // ISO string
  meetingStartDate?: Date | null; // ISO string
  meetingEndDate?: Date | null; // ISO string
  paidStatus?: boolean | null;
  rating?: number | null;
  linkedInLink?: string | null;
  sourceEmailId?: string | null;
  finalStatusSourceEmailId?: string | null;
  finalCallDateTimeSourceEmailId?: string | null;
  finalTardyToCallSourceEmailId?: string | null;
  finalAbsentFromCallSourceEmailId?: string | null;
  checked?: boolean | null;
  callScheduled: boolean;
  dismissed: boolean;
  companySize?: string | null;
  vendorsUsed?: string | null;
  interviewLead?: string | null;
  noteTaker?: string | null;
  postInterviewRating?: number | null;
  postInterviewComments?: string | null;
  transcript?: string | null;
  audioFileLink?: string | null;
  notesFromCall?: string | null;
  fraudFlag?: boolean | null;
  metaExpertId?: string | null;
  profilePictureLink?: string | null;
  email?: string | null;
  phone?: string | null;
  strikes?: number | null;
  linkedInCreationDate?: Date | null; // ISO string
  linkedInConnectionCount?: number | null;
  surveyDuration?: number | null;
  tardyToCall?: boolean | null;
  absentFromCall?: boolean | null;
  probabilityOfAIScreeners?: number | null;
  assignedToId?: string | null;
  ableToSpeakToTopics?: boolean | null;
  likelihoodOfReengagement?: number | null;
  topicsAbleToSpeakTo?: string | null;
  fraudReason?: string | null;
  duplicate?: boolean | null;
  furtherInfo?: string | null;
  lowestCost?: boolean | null;
  questions: ExpertQuestion[];
  availabilities: Availability[];
  jobs: Job[];
  percentEssential?: number | null;
  percentTotal?: number | null;
  enrichedLinkedIn?: boolean | null;
  aiMatchCalculated?: boolean | null;
  quoteAttribution?: string | null;
  actualCost?: number | null;
  comments?: Comment[];
  internalStatusColor?: string | null;
  expertNetworkDuplicateCombination?: string | null;
  showInExpertTable?: boolean | null;
  subProfileTypeName?: string | null;
  subProfileTypeId?: string | null;
  screened: String;
  firstSourced: boolean;
  meetingStartTime?: Date | null;
  creditCost?: number | null;
  checkedTime?: Date | null;
  aiAssessmentScores?: AIAssessmentScore[];
}
// Utility function to convert JSON into an Expert object
export const expertFromJson = (
  expertJson: any,
  jsonData: {
    experts: Expert[];
    availabilities: Availability[];
    questions: ExpertQuestion[];
    jobs: Job[];
    comments: Comment[];
    aiAssessmentScores: AIAssessmentScore[];
  },
  costs: ExpertNetworkRelationship[],
  currentProject: Project | null
): Expert => {
  const thisProject = currentProject;

  if (new Set(costs.flatMap((c) => c.organizationId)).size > 1) {
    costs = costs.filter((c) => c.organizationId === expertJson.organizationId);
  }

  const profileType = thisProject?.profileTypes?.find(
    (profileType) => profileType.id === expertJson.profileTypeId
  ) || { id: "", projectId: "", name: "Missing Profile" };

  const subProfileType = thisProject?.profileTypes
    ?.find((profileType) => profileType.id === expertJson.profileTypeId)
    ?.subProfileTypes?.find(
      (subProfileType) => subProfileType.id === expertJson.subProfileTypeId
    ) || { id: "", projectId: "", name: "None" };

  const expertQuestions = (jsonData.questions || [])
    .filter((question: any) => question.expertId === expertJson.id)
    .map((question: any) => expertQuestionFromJson(question, thisProject));

  const screenedQuestionsCount =
    expertQuestions
      ?.filter((q) => q.sourceProjectQuestionId !== null)
      .filter(
        (q) => !["No reply", "No response", "-", "N/A"].includes(q.answer)
      ).length || 0;

  const questionsCount =
    thisProject?.projectQuestions?.filter(
      (q) => q.profileTypeId === expertJson.profileTypeId
    )?.length || 0;

  const isScreened =
    questionsCount > 0 ? screenedQuestionsCount >= questionsCount / 2 : false;

  return {
    id: expertJson.id || "",
    name: expertJson.name || null,
    organizationId: expertJson.organizationId || null,
    projectId: expertJson.projectId || null,
    favorite: expertJson.favorite ?? false,
    selected: expertJson.selected ?? false,
    profession: expertJson.profession || null,
    company: expertJson.company || null,
    profileTypeName: profileType.name || null,
    subProfileTypeName: subProfileType.name || null,
    subProfileTypeId: subProfileType.id || null,
    departureTime: expertJson.departureTime || null,
    description: expertJson.description || null,
    geography: expertJson.geography || null,
    profileTypeId: expertJson.profileTypeId || null,
    status: expertJson.status || "Missing Status",
    internalStatus: expertJson.internalStatus || null,
    aiAssessment:
      expertJson.aiAssessment !== undefined
        ? parseFloat(expertJson.aiAssessment)
        : 0,
    aiAnalysis: expertJson.aiAnalysis || "",
    aiRationale: expertJson.aiRationale || null,
    expertNetworkName: expertJson.expertNetworkName || null,
    expertNetworkDuplicateCombination: expertJson.expertNetworkName || null,
    cost: expertJson.cost !== undefined ? parseFloat(expertJson.cost) : null,
    currency: expertJson.currency || null,
    addedExpertById: expertJson.addedExpertById || null,
    dateAddedExpert: expertJson.dateAddedCall
      ? new Date(expertJson.dateAddedCall)
      : expertJson.dateAddedExpert
      ? new Date(expertJson.dateAddedExpert)
      : null,
    addedCallById: expertJson.addedCallById || null,
    dateAddedCall: expertJson.dateAddedCall
      ? new Date(expertJson.dateAddedCall)
      : null,
    meetingStartDate: expertJson.meetingStartDate
      ? new Date(expertJson.meetingStartDate)
      : null,
    meetingEndDate: expertJson.meetingEndDate
      ? new Date(expertJson.meetingEndDate)
      : null,
    paidStatus: expertJson.paidStatus ?? null,
    rating:
      expertJson.rating !== undefined
        ? Math.round(parseFloat(expertJson.rating))
        : null,
    linkedInLink: expertJson.linkedInLink || null,
    sourceEmailId: expertJson.sourceEmailId || null,
    finalStatusSourceEmailId: expertJson.finalStatusSourceEmailId || null,
    finalCallDateTimeSourceEmailId:
      expertJson.finalCallDateTimeSourceEmailId || null,
    finalTardyToCallSourceEmailId:
      expertJson.finalTardyToCallSourceEmailId || null,
    finalAbsentFromCallSourceEmailId:
      expertJson.finalAbsentFromCallSourceEmailId || null,
    checked: expertJson.checked ?? null,
    callScheduled: isCompletedOrScheduled(expertJson.status),
    dismissed: isDismissed(expertJson.status) ?? false,
    companySize: expertJson.companySize || null,
    vendorsUsed: expertJson.vendorsUsed || null,
    interviewLead: expertJson.interviewLead || null,
    noteTaker: expertJson.noteTaker || null,
    postInterviewRating:
      expertJson.postInterviewRating !== undefined
        ? parseFloat(expertJson.postInterviewRating)
        : null,
    postInterviewComments: expertJson.postInterviewComments || null,
    transcript: expertJson.transcript || null,
    audioFileLink: expertJson.audioFileLink || null,
    notesFromCall: expertJson.notesFromCall || null,
    fraudFlag: expertJson.fraudFlag ?? false,
    metaExpertId: expertJson.metaExpertId || null,
    profilePictureLink: expertJson.profilePictureLink || null,
    email: expertJson.email || null,
    phone: expertJson.phone || null,
    strikes: expertJson.strikes ?? 0,
    linkedInCreationDate: expertJson.linkedInCreationDate
      ? new Date(expertJson.linkedInCreationDate)
      : null,
    linkedInConnectionCount: expertJson.linkedInConnectionCount ?? 0,
    surveyDuration: expertJson.surveyDuration ?? 0,
    tardyToCall: expertJson.tardyToCall ?? false,
    absentFromCall: expertJson.absentFromCall ?? false,
    probabilityOfAIScreeners:
      expertJson.probabilityOfAIScreeners !== undefined
        ? parseFloat(expertJson.probabilityOfAIScreeners)
        : null,
    assignedToId: expertJson.assignedToId || null,
    ableToSpeakToTopics: expertJson.ableToSpeakToTopics ?? null,
    likelihoodOfReengagement:
      expertJson.likelihoodOfReengagement !== undefined
        ? parseInt(expertJson.likelihoodOfReengagement)
        : null,
    topicsAbleToSpeakTo: expertJson.topicsAbleToSpeakTo || null,
    fraudReason: expertJson.fraudReason || null,
    furtherInfo: expertJson.furtherInfo || null,
    lowestCost: expertJson.lowestCost ?? null,
    percentEssential:
      expertJson.percentEssential !== undefined
        ? parseFloat(expertJson.percentEssential)
        : null,
    percentTotal:
      expertJson.percentTotal !== undefined
        ? parseFloat(expertJson.percentTotal)
        : null,
    enrichedLinkedIn: expertJson.enrichedLinkedIn ?? null,
    aiMatchCalculated: expertJson.aiMatchCalculated ?? null,
    quoteAttribution: expertJson.quoteAttribution || null,
    actualCost: getActualCost(
      expertJson.cost,
      expertJson.currency,
      costs,
      expertJson.expertNetworkName
    ),
    comments: (jsonData.comments || [])
      .filter((comment: any) => comment.expertId === expertJson.id)
      .map(commentFromJson),
    questions: expertQuestions,
    availabilities: (jsonData.availabilities || [])
      .filter((availability: any) => availability.expertId === expertJson.id)
      .map(availabilityFromJson),
    jobs: (jsonData.jobs || [])
      .filter((job: any) => job.expertId === expertJson.id)
      .map(jobFromJson),
    internalStatusColor: getStatusColor(expertJson.internalStatus, thisProject),
    showInExpertTable: true,
    screened: isScreened ? "Screened" : "Unscreened",
    firstSourced: false,
    meetingStartTime: expertJson.meetingStartDate
      ? new Date(expertJson.meetingStartDate)
      : null,
    creditCost: getCreditCost(
      expertJson.cost,
      expertJson.currency,
      costs,
      expertJson.expertNetworkName
    ),
    checkedTime: expertJson.checkedTime || null,
    aiAssessmentScores: (jsonData.aiAssessmentScores || [])
      .filter((score: any) => score.expertId === expertJson.id)
      .map(aiAssessmentScoreFromJson),
  };
};
// Utility function to convert an Expert object into JSON
export const expertToJson = (expert: Expert): Record<string, any> => {
  return {
    id: expert.id,
    name: expert.name || null,
    organizationId: expert.organizationId || null,
    projectId: expert.projectId || null,
    favorite: expert.favorite.toString(),
    selected: expert.selected?.toString() || null,
    profession: expert.profession || null,
    company: expert.company || null,
    departureTime: expert.departureTime || null,
    quoteAttribution: expert.quoteAttribution || null,
    description: expert.description || null,
    geography: expert.geography || null,
    profileTypeId: expert.profileTypeId || null,
    status: expert.status || "Missing Status",
    internalStatus: expert.internalStatus || null,
    aiAssessment:
      expert.aiAssessment !== null && expert.aiAssessment !== undefined
        ? expert.aiAssessment.toString()
        : null,
    aiAnalysis: expert.aiAnalysis || null,
    aiRationale: expert.aiRationale || null,
    comments: expert.comments || null,
    expertNetworkName: expert.expertNetworkName || null,
    cost:
      expert.cost !== null && expert.cost !== undefined
        ? expert.cost.toString()
        : null,
    currency: expert.currency || null,
    addedExpertById: expert.addedExpertById || null,
    dateAddedExpert: expert.dateAddedExpert
      ? expert.dateAddedExpert.toISOString()
      : null,
    addedCallById: expert.addedCallById || null,
    dateAddedCall: expert.dateAddedCall
      ? expert.dateAddedCall.toISOString()
      : null,
    meetingStartDate: expert.meetingStartDate
      ? expert.meetingStartDate.toISOString()
      : null,
    meetingEndDate: expert.meetingEndDate
      ? expert.meetingEndDate.toISOString()
      : null,
    paidStatus:
      expert.paidStatus !== null && expert.paidStatus !== undefined
        ? expert.paidStatus.toString()
        : null,
    rating:
      expert.rating !== null && expert.rating !== undefined
        ? Math.round(expert.rating).toString()
        : null,
    linkedInLink: expert.linkedInLink || null,
    sourceEmailId: expert.sourceEmailId || null,
    finalStatusSourceEmailId: expert.finalStatusSourceEmailId || null,
    finalCallDateTimeSourceEmailId:
      expert.finalCallDateTimeSourceEmailId || null,
    finalTardyToCallSourceEmailId: expert.finalTardyToCallSourceEmailId || null,
    finalAbsentFromCallSourceEmailId:
      expert.finalAbsentFromCallSourceEmailId || null,
    checked:
      expert.checked !== null && expert.checked !== undefined
        ? expert.checked.toString()
        : null,
    callScheduled: expert.callScheduled.toString(),
    dismissed: expert.dismissed.toString(),
    companySize: expert.companySize || null,
    vendorsUsed: expert.vendorsUsed || null,
    interviewLead: expert.interviewLead || null,
    noteTaker: expert.noteTaker || null,
    postInterviewRating:
      expert.postInterviewRating !== null &&
      expert.postInterviewRating !== undefined
        ? expert.postInterviewRating.toString()
        : null,
    postInterviewComments: expert.postInterviewComments || null,
    transcript: expert.transcript || null,
    audioFileLink: expert.audioFileLink || null,
    notesFromCall: expert.notesFromCall || null,
    fraudFlag:
      expert.fraudFlag !== null && expert.fraudFlag !== undefined
        ? expert.fraudFlag.toString()
        : null,
    metaExpertId: expert.metaExpertId || null,
    profilePictureLink: expert.profilePictureLink || null,
    email: expert.email || null,
    phone: expert.phone || null,
    strikes:
      expert.strikes !== null && expert.strikes !== undefined
        ? expert.strikes.toString()
        : null,
    linkedInCreationDate: expert.linkedInCreationDate
      ? expert.linkedInCreationDate.toISOString()
      : null,
    linkedInConnectionCount:
      expert.linkedInConnectionCount !== null &&
      expert.linkedInConnectionCount !== undefined
        ? expert.linkedInConnectionCount.toString()
        : null,
    surveyDuration:
      expert.surveyDuration !== null && expert.surveyDuration !== undefined
        ? expert.surveyDuration.toString()
        : null,
    tardyToCall: expert.tardyToCall.toString(),
    absentFromCall: expert.absentFromCall.toString(),
    probabilityOfAIScreeners:
      expert.probabilityOfAIScreeners !== null &&
      expert.probabilityOfAIScreeners !== undefined
        ? expert.probabilityOfAIScreeners.toString()
        : null,
    assignedToId: expert.assignedToId || null,
    topicsAbleToSpeakTo: expert.topicsAbleToSpeakTo || null,
    ableToSpeakToTopics: expert.ableToSpeakToTopics.toString(),
    likelihoodOfReengagement:
      expert.likelihoodOfReengagement !== null &&
      expert.likelihoodOfReengagement !== undefined
        ? expert.likelihoodOfReengagement.toString()
        : null,
    fraudReason: expert.fraudReason || null,
    furtherInfo: expert.furtherInfo || null,
    percentEssential:
      expert.percentEssential !== null && expert.percentEssential !== undefined
        ? expert.percentEssential.toString()
        : null,
    percentTotal:
      expert.percentTotal !== null && expert.percentTotal !== undefined
        ? expert.percentTotal.toString()
        : null,
    enrichedLinkedIn:
      expert.enrichedLinkedIn !== null && expert.enrichedLinkedIn !== undefined
        ? expert.enrichedLinkedIn.toString()
        : null,
    aiMatchCalculated:
      expert.aiMatchCalculated !== null &&
      expert.aiMatchCalculated !== undefined
        ? expert.aiMatchCalculated.toString()
        : null,
    checkedTime: expert.checkedTime || null,
    aiAssessmentScores: expert.aiAssessmentScores || null,
  };
};

const isCompletedOrScheduled = (status: string | null): boolean => {
  const validStatuses = ["completed", "scheduled"];
  return validStatuses.includes(status?.toLowerCase() || "");
};

const isDismissed = (status: string | null): boolean => {
  const validStatuses = ["dismissed", "dismissed - bad call"];
  return validStatuses.includes(status?.toLowerCase() || "");
};

export const getActualCost = (
  cost: number | null,
  currency: string | null,
  costs: ExpertNetworkRelationship[],
  expertNetworkName?: string | null
): number | null => {
  if (cost === null) {
    return (
      costs.find((c) => c.expertNetwork === expertNetworkName)?.costPerCredit ??
      null
    );
  }

  // If cost is 0, treat it as 1
  const interpretedCost = cost === 0 ? 1 : cost;

  if (currency === "XXX" || currency === "CU") {
    const costPerCredit =
      costs.find((c) => c.expertNetwork === expertNetworkName)?.costPerCredit ??
      0;
    return interpretedCost * costPerCredit;
  }

  return interpretedCost;
};

export const getCreditCost = (
  actualCost: number | null,
  currency: string | null,
  costs: ExpertNetworkRelationship[],
  expertNetworkName?: string | null
): number | null => {
  if (actualCost === null) {
    return (
      costs.find((c) => c.expertNetwork === expertNetworkName)?.costPerCredit ??
      null
    );
  }

  if (currency !== "XXX" && currency !== "CU") {
    const costPerCredit =
      costs.find((c) => c.expertNetwork === expertNetworkName)?.costPerCredit ??
      1;
    // If the actual cost is 0, we mimic the forward function by treating it as the cost for 1 credit.
    const interpretedCost = actualCost === 0 ? costPerCredit : actualCost;
    return costPerCredit ? interpretedCost / costPerCredit : 1;
  }

  return actualCost;
};
