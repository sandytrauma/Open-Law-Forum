// src/constants/types/index.ts
export interface NavLink {
  name: string;
  path: string;
}

export interface Sublink {
  name: string;
  path: string;
}

export interface ActSection {
  title?: string;
  section_title?: string;
  description?: string;
  section_desc?: string;
  section?: string; 
  article?: number | string;
  content?: string;

}

export type ActSections = ActSection[]; 

// src/constants/types.ts
export interface ActData {
  metadata: {
    actTitle: string;
    enactmentDate: string;
  };
  actDefinition: {
    [key: string]: string;
  };
  parts: {
    [partID: string]: {
      Name: string;
      Sections: {
        [sectionID: string]: {
          heading: string;
          paragraphs: {
            [paragraphID: string]: {
              text: string;
              contains?: { text: string }[];
            };
          };
        };
      };
    };
  };
}
