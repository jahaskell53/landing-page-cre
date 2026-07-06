/**
 * Early-access waitlist questionnaire definition.
 *
 * The shape mirrors the fields stored by the app's `POST /api/waitlist` route
 * (email, roles, states, asset_classes, deals_per_year, objectives). Editing the
 * copy or options here is safe: the API sanitizes by type, not by a fixed
 * allow-list, so option labels can change without a backend deploy.
 */

export type WaitlistQuestion =
    | {
          id: "email";
          type: "email";
          title: string;
          description?: string;
          required: true;
          placeholder?: string;
      }
    | {
          id: "roles";
          type: "multi";
          title: string;
          description?: string;
          required: boolean;
          options: string[];
          searchable?: boolean;
      }
    | {
          id: "states" | "asset_classes";
          type: "multi";
          title: string;
          description?: string;
          required: boolean;
          options: string[];
          searchable?: boolean;
      }
    | {
          id: "deals_per_year";
          type: "single";
          title: string;
          description?: string;
          required: boolean;
          options: string[];
      }
    | {
          id: "objectives";
          type: "longtext";
          title: string;
          description?: string;
          required: boolean;
          placeholder?: string;
      };

export type WaitlistAnswers = {
    email: string;
    roles: string[];
    states: string[];
    asset_classes: string[];
    deals_per_year: string | null;
    objectives: string;
};

export const EMPTY_ANSWERS: WaitlistAnswers = {
    email: "",
    roles: [],
    states: [],
    asset_classes: [],
    deals_per_year: null,
    objectives: "",
};

const ROLE_OPTIONS = [
    "Property Owner / Operator",
    "Investor / Syndicator",
    "CRE Broker",
    "CRE Lender / Capital Provider",
    "Property Manager",
    "Appraiser / Valuation Specialist",
    "1031 Exchange Advisor",
    "Insurance Agent",
    "Other",
];

const ASSET_CLASS_OPTIONS = ["Multifamily", "Retail", "Industrial / Flex", "Office", "Mixed-Use / Other"];

const DEALS_PER_YEAR_OPTIONS = ["0–2", "3–5", "6–10", "11–25", "25+"];

const STATE_OPTIONS = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
    "District of Columbia",
];

export const WAITLIST_QUESTIONS: WaitlistQuestion[] = [
    {
        id: "email",
        type: "email",
        title: "Let's start with your email",
        description: "This is where your early-access invite will land.",
        required: true,
        placeholder: "you@company.com",
    },
    {
        id: "roles",
        type: "multi",
        title: "Which best describes your role?",
        description: "Select all that apply.",
        required: true,
        options: ROLE_OPTIONS,
    },
    {
        id: "states",
        type: "multi",
        title: "Which states do you operate in?",
        description: "Optional. Search and select any that apply.",
        required: false,
        options: STATE_OPTIONS,
        searchable: true,
    },
    {
        id: "asset_classes",
        type: "multi",
        title: "What asset classes do you focus on?",
        description: "Optional. Select all that apply.",
        required: false,
        options: ASSET_CLASS_OPTIONS,
    },
    {
        id: "deals_per_year",
        type: "single",
        title: "Roughly how many deals do you close per year?",
        description: "Optional.",
        required: false,
        options: DEALS_PER_YEAR_OPTIONS,
    },
    {
        id: "objectives",
        type: "longtext",
        title: "What are your primary objectives with OpenMidmarket?",
        description: "Optional. A sentence or two helps us tailor your early access.",
        required: false,
        placeholder: "e.g. Find off-market multifamily deals in the Southeast…",
    },
];
