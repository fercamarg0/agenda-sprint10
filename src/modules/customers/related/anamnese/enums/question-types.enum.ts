export enum AnamneseQuestionType {
  TEXT = "text",
  BOOLEAN = "boolean",
  BOOLEAN_WITH_DETAILS = "boolean_with_details",
  MULTIPLE_CHOICE = "multiple_choice",
  SECTION = "section",
}
export class QuestionTypeInfo {
  name: string;
  responseFields: string[];
  allowsItems: boolean;
}
export const QUESTION_TYPES_INFO: QuestionTypeInfo[] = [
  {
    name: "Texto Livre",
    responseFields: ["textAnswer"],
    allowsItems: false,
  },
  {
    name: "Sim/Não",
    responseFields: ["booleanAnswer"],
    allowsItems: false,
  },
  {
    name: "Sim/Não com Detalhes",
    responseFields: ["booleanAnswer", "textAnswer"],
    allowsItems: false,
  },
  {
    name: "Múltipla Escolha",
    responseFields: ["anamneseQuestionItemIds"],
    allowsItems: true,
  },
  {
    name: "Seção",
    responseFields: [],
    allowsItems: false,
  },
];
