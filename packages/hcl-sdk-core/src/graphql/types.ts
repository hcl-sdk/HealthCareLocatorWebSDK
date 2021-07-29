export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Map: any;
  Time: any;
};

export type Activity = OneKeyEntity & {
  __typename?: 'Activity';
  id: Scalars['ID'];
  role: KeyedString;
  title: KeyedString;
  phone?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  webAddress?: Maybe<Scalars['String']>;
  individual: Individual;
  workplace: Workplace;
};

export type ActivityFragment = OneKeyEntity & {
  __typename?: 'ActivityFragment';
  id: Scalars['ID'];
  role: KeyedString;
  title: KeyedString;
  phone?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  webAddress?: Maybe<Scalars['String']>;
  individual: IndividualFragment;
  workplace: Workplace;
};

export type ActivityQueryEntry = {
  __typename?: 'ActivityQueryEntry';
  when?: Maybe<Scalars['Date']>;
  activity?: Maybe<ActivityFragment>;
};

export type ActivityResult = {
  __typename?: 'ActivityResult';
  distance?: Maybe<Scalars['Int']>;
  relevance?: Maybe<Scalars['Int']>;
  activity: ActivityFragment;
};

export type Address = {
  __typename?: 'Address';
  id: Scalars['ID'];
  longLabel: Scalars['String'];
  buildingLabel?: Maybe<Scalars['String']>;
  country: Scalars['String'];
  county?: Maybe<KeyedString>;
  city: KeyedString;
  postalCode: Scalars['String'];
  location?: Maybe<Geopoint>;
};

export type Code = {
  __typename?: 'Code';
  id?: Maybe<Scalars['String']>;
  lisLbl: Scalars['String'];
  lisCode: Scalars['String'];
  updateDate?: Maybe<Scalars['String']>;
  dbCode?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  longLbl: Scalars['String'];
  shortLbl?: Maybe<Scalars['String']>;
};

export type CodeResult = {
  __typename?: 'CodeResult';
  codes?: Maybe<Array<Maybe<Code>>>;
};

export type CountyQuery = {
  county: Scalars['String'];
};

export type DailyOpenHours = {
  __typename?: 'DailyOpenHours';
  day?: Maybe<Day>;
  openPeriods: OpenPeriod;
};

export type DataQualityAssessment = {
  grade: Scalars['String'];
  comment?: Maybe<Scalars['String']>;
};


export enum Day {
  Monday = 'MONDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
  Thursday = 'THURSDAY',
  Friday = 'FRIDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY'
}

export enum GeoAccurracy {
  HouseNumber = 'HouseNumber'
}

export type Geopoint = {
  __typename?: 'Geopoint';
  lat: Scalars['Float'];
  lon: Scalars['Float'];
};

export type GeopointQuery = {
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  distanceMeter?: Maybe<Scalars['Float']>;
};

export type History = {
  __typename?: 'History';
  activities: Array<ActivityQueryEntry>;
};

export type Individual = OneKeyEntity & {
  __typename?: 'Individual';
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  maidenName?: Maybe<Scalars['String']>;
  mailingName?: Maybe<Scalars['String']>;
  firstNameInitials?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  suffixName?: Maybe<Scalars['String']>;
  professionalType: KeyedString;
  specialties: Array<KeyedString>;
  webAddress?: Maybe<Scalars['String']>;
  mainActivity: Activity;
  otherActivities: Array<Activity>;
  meshTerms?: Maybe<Array<Scalars['String']>>;
  kvTerms?: Maybe<Array<Scalars['String']>>;
  chTerms?: Maybe<Array<Scalars['String']>>;
};

export type IndividualFragment = OneKeyEntity & {
  __typename?: 'IndividualFragment';
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  maidenName?: Maybe<Scalars['String']>;
  mailingName?: Maybe<Scalars['String']>;
  firstNameInitials?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  suffixName?: Maybe<Scalars['String']>;
  professionalType: KeyedString;
  specialties: Array<KeyedString>;
  webAddress?: Maybe<Scalars['String']>;
};

export type IndividualResult = {
  __typename?: 'IndividualResult';
  individuals?: Maybe<Array<Maybe<IndividualWorkPlaceDetails>>>;
};

export type IndividualWorkPlaceDetails = OneKeyEntity & {
  __typename?: 'IndividualWorkPlaceDetails';
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  maidenName?: Maybe<Scalars['String']>;
  mailingName?: Maybe<Scalars['String']>;
  firstNameInitials?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  suffixName?: Maybe<Scalars['String']>;
  professionalType: KeyedString;
  specialties: Array<KeyedString>;
  webAddress?: Maybe<Scalars['String']>;
  mainActivity: Activity;
  otherActivities: Array<Activity>;
};

export type KeyedString = {
  __typename?: 'KeyedString';
  code: Scalars['String'];
  label: Scalars['String'];
};


export type Mutation = {
  __typename?: 'Mutation';
  postDataQualityAssesmentForActivity?: Maybe<Scalars['String']>;
  postRevisionRequest?: Maybe<Scalars['String']>;
  ForgetHistoryEntries?: Maybe<Scalars['String']>;
};


export type MutationPostDataQualityAssesmentForActivityArgs = {
  userId?: Maybe<Scalars['String']>;
  activityId: Scalars['ID'];
  grade: DataQualityAssessment;
};


export type MutationPostRevisionRequestArgs = {
  request: RevisionRequest;
};


export type MutationForgetHistoryEntriesArgs = {
  individuals?: Maybe<Array<Scalars['ID']>>;
  queries?: Maybe<Array<Scalars['ID']>>;
};

export type OneKeyEntity = {
  id: Scalars['ID'];
};

export type OpenPeriod = {
  __typename?: 'OpenPeriod';
  open?: Maybe<Scalars['Time']>;
  close?: Maybe<Scalars['Time']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
};

export enum QualityGrade {
  Ok = 'OK',
  Nok = 'NOK'
}

export type QualityReport = {
  __typename?: 'QualityReport';
  userId?: Maybe<Scalars['String']>;
  apiKey?: Maybe<Scalars['String']>;
  activityId?: Maybe<Scalars['String']>;
  grade?: Maybe<Scalars['String']>;
  comments?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  individualByID?: Maybe<Individual>;
  activityByID?: Maybe<Activity>;
  workplaceById?: Maybe<Workplace>;
  activities?: Maybe<Array<Maybe<ActivityResult>>>;
  individualsByName?: Maybe<IndividualResult>;
  codesByLabel?: Maybe<CodeResult>;
  history?: Maybe<History>;
};


export type QueryIndividualByIdArgs = {
  userId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  locale?: Maybe<Scalars['String']>;
};


export type QueryActivityByIdArgs = {
  userId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  locale?: Maybe<Scalars['String']>;
};


export type QueryWorkplaceByIdArgs = {
  userId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  locale?: Maybe<Scalars['String']>;
};


export type QueryActivitiesArgs = {
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  professionalType?: Maybe<Scalars['String']>;
  specialties?: Maybe<Array<Scalars['String']>>;
  location?: Maybe<GeopointQuery>;
  county?: Maybe<Scalars['String']>;
  criteria?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  medTerms: Maybe<Array<Scalars['String']>>;
};


export type QueryIndividualsByNameArgs = {
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['String']>;
  criteria: Scalars['String'];
  locale?: Maybe<Scalars['String']>;
};


export type QueryCodesArgs = {
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['String']>;
  criteria: Scalars['String'];
  codeTypes: Array<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
};


export type QueryHistoryArgs = {
  userId: Scalars['String'];
};

export type RevisionRequest = {
  id: Scalars['ID'];
};


export type Translations = {
  __typename?: 'Translations';
  Code?: Maybe<Scalars['String']>;
  Translation?: Maybe<Scalars['String']>;
};

export type WeeklyOpenHours = {
  __typename?: 'WeeklyOpenHours';
  openDays: DailyOpenHours;
};

export type Workplace = OneKeyEntity & {
  __typename?: 'Workplace';
  id: Scalars['ID'];
  name: Scalars['String'];
  officialName?: Maybe<Scalars['String']>;
  type: KeyedString;
  localPhone?: Maybe<Scalars['String']>;
  intlPhone?: Maybe<Scalars['String']>;
  intlFax?: Maybe<Scalars['String']>;
  webAddress?: Maybe<Scalars['String']>;
  emailAddress?: Maybe<Scalars['String']>;
  address: Address;
  openHours?: Maybe<Array<Maybe<WeeklyOpenHours>>>;
  parentId?: Maybe<Scalars['String']>;
};
