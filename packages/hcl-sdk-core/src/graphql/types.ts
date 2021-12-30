export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  main_flag?: Maybe<Scalars['String']>;
  role: KeyedString;
  title: KeyedString;
  phone?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  webAddress?: Maybe<Scalars['String']>;
  individual: Individual;
  workplace: Workplace;
};

export type ActivityCriteria = {
  text?: InputMaybe<Scalars['String']>;
  scope?: InputMaybe<ActivityCriteriaScope>;
};

export enum ActivityCriteriaScope {
  IndividualName = 'IndividualName',
  IndividualNameAutocomplete = 'IndividualNameAutocomplete',
  IndividualMedTerms = 'IndividualMedTerms'
}

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

export type ActivityList = OneKeyEntity & {
  __typename?: 'ActivityList';
  id: Scalars['ID'];
  main_flag?: Maybe<Scalars['String']>;
  role: KeyedString;
  title: KeyedString;
  phone?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  webAddress?: Maybe<Scalars['String']>;
  workplace: Workplace;
};

export type ActivityQueryEntry = {
  __typename?: 'ActivityQueryEntry';
  when?: Maybe<Scalars['Date']>;
  activity?: Maybe<ActivityFragment>;
};

export type ActivityResult = {
  __typename?: 'ActivityResult';
  distance?: Maybe<Scalars['Float']>;
  relevance?: Maybe<Scalars['Int']>;
  activity: ActivityFragment;
};

export enum ActivitySortScope {
  WorkplaceDistance = 'WorkplaceDistance',
  IndividualName = 'IndividualName',
  Relevancy = 'Relevancy'
}

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

export type Audience = {
  __typename?: 'Audience';
  label?: Maybe<Scalars['String']>;
};

export enum AutocompleteCriteriaScope {
  Name = 'Name',
  Specialty = 'Specialty',
  Address = 'Address',
  MedTerm = 'MedTerm'
}

export type AutocompleteFragment = OneKeyEntity & {
  __typename?: 'AutocompleteFragment';
  id: Scalars['ID'];
  individual: IndividualAutocompleteFragment;
  address: Address;
  specialty?: Maybe<KeyedString>;
  medTerm?: Maybe<KeyedString>;
};

export type AutocompleteResult = {
  __typename?: 'AutocompleteResult';
  from?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
  results?: Maybe<Array<Maybe<AutocompleteFragment>>>;
};

export type CityQuery = {
  code?: InputMaybe<Scalars['String']>;
  label?: InputMaybe<Scalars['String']>;
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

export type CodeCriteria = {
  text?: InputMaybe<Scalars['String']>;
  scope?: InputMaybe<CodeCriteriaScope>;
};

export enum CodeCriteriaScope {
  LongLbl = 'LongLbl',
  LongLblAutocomplete = 'LongLblAutocomplete',
  Id = 'Id'
}

export type CodeResult = {
  __typename?: 'CodeResult';
  codes?: Maybe<Array<Maybe<Code>>>;
};

export type Country = {
  __typename?: 'Country';
  code?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
};

export type CountyQuery = {
  code?: InputMaybe<Scalars['String']>;
  label?: InputMaybe<Scalars['String']>;
};

export type Criteria = {
  __typename?: 'Criteria';
  id?: Maybe<Scalars['String']>;
  professionalType?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['String']>;
  log?: Maybe<Scalars['String']>;
  radius?: Maybe<Scalars['String']>;
  county?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  criteria?: Maybe<Scalars['String']>;
};

export type DailyOpenHours = {
  __typename?: 'DailyOpenHours';
  day?: Maybe<Day>;
  openPeriods: OpenPeriod;
};

export type DataQualityAssessment = {
  grade: Scalars['String'];
  comment?: InputMaybe<Scalars['String']>;
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

export type Disease = {
  __typename?: 'Disease';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

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
  distanceMeter?: InputMaybe<Scalars['Float']>;
};

export type HistoryActivityResult = {
  __typename?: 'HistoryActivityResult';
  userId?: Maybe<Scalars['String']>;
  subscriptionId?: Maybe<Scalars['String']>;
  when?: Maybe<Scalars['String']>;
  activityId?: Maybe<Scalars['String']>;
};

export type HistoryQueryResult = {
  __typename?: 'HistoryQueryResult';
  queryId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  subscriptionId?: Maybe<Scalars['String']>;
  when?: Maybe<Scalars['String']>;
  filterCriteria?: Maybe<Criteria>;
};

export type Individual = OneKeyEntity & {
  __typename?: 'Individual';
  id: Scalars['ID'];
  title: KeyedString;
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
  mainActivity: ActivityList;
  otherActivities: Array<ActivityList>;
  meshTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  kvTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  chTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  uci?: Maybe<Uci>;
  reviewsAvailable?: Maybe<Scalars['Boolean']>;
  diseasesAvailable?: Maybe<Scalars['Boolean']>;
};

export type IndividualAutocompleteFragment = OneKeyEntity & {
  __typename?: 'IndividualAutocompleteFragment';
  id: Scalars['ID'];
  title: KeyedString;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
};

export type IndividualFragment = OneKeyEntity & {
  __typename?: 'IndividualFragment';
  id: Scalars['ID'];
  title: KeyedString;
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
  meshTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  kvTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  chTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  uci?: Maybe<Uci>;
  reviewsAvailable?: Maybe<Scalars['Boolean']>;
  diseasesAvailable?: Maybe<Scalars['Boolean']>;
};

export type IndividualResult = {
  __typename?: 'IndividualResult';
  individuals?: Maybe<Array<Maybe<IndividualWorkPlaceDetails>>>;
};

export type IndividualWorkPlaceDetails = OneKeyEntity & {
  __typename?: 'IndividualWorkPlaceDetails';
  id: Scalars['ID'];
  title: KeyedString;
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
};

export type KeyedString = {
  __typename?: 'KeyedString';
  code: Scalars['String'];
  label: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  ForgetHistoryActivityEntries?: Maybe<Scalars['String']>;
  ForgetHistoryQueryEntry?: Maybe<Scalars['String']>;
  postDataQualityAssesmentForActivity?: Maybe<Scalars['String']>;
  postRevisionRequest?: Maybe<Scalars['String']>;
};


export type MutationForgetHistoryActivityEntriesArgs = {
  activityId: Scalars['ID'];
};


export type MutationForgetHistoryQueryEntryArgs = {
  query: Scalars['ID'];
};


export type MutationPostDataQualityAssesmentForActivityArgs = {
  userId?: InputMaybe<Scalars['String']>;
  activityId: Scalars['ID'];
  grade: DataQualityAssessment;
};


export type MutationPostRevisionRequestArgs = {
  request: RevisionRequest;
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
  activities?: Maybe<Array<Maybe<ActivityResult>>>;
  activityByID?: Maybe<Activity>;
  codesByLabel?: Maybe<CodeResult>;
  historyBYQuery?: Maybe<Array<Maybe<HistoryQueryResult>>>;
  historyBYActivityId?: Maybe<Array<Maybe<HistoryActivityResult>>>;
  individualByID?: Maybe<Individual>;
  individualsByName?: Maybe<IndividualResult>;
  labelsByCode?: Maybe<CodeResult>;
  listAudiences?: Maybe<Array<Maybe<Audience>>>;
  listCountry?: Maybe<Array<Maybe<Country>>>;
  workplaceById?: Maybe<Workplace>;
  autocomplete?: Maybe<AutocompleteResult>;
  reviewsByIndividual?: Maybe<ReviewResult>;
  mySubscriptionKey?: Maybe<SubscriptionKey>;
};


export type QueryActivitiesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  criteria?: InputMaybe<Scalars['String']>;
  criteriaScope?: InputMaybe<ActivityCriteriaScope>;
  criterias?: InputMaybe<Array<InputMaybe<ActivityCriteria>>>;
  sortScope?: InputMaybe<ActivitySortScope>;
  sorts?: InputMaybe<Array<InputMaybe<ActivitySortScope>>>;
  locale?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<GeopointQuery>;
  country?: InputMaybe<Scalars['String']>;
  county?: InputMaybe<Scalars['String']>;
  professionalType?: InputMaybe<Scalars['String']>;
  specialties?: InputMaybe<Array<Scalars['String']>>;
  medTerms?: InputMaybe<Array<Scalars['String']>>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryActivityByIdArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryCodesByLabelArgs = {
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  criteria?: InputMaybe<Scalars['String']>;
  criteriaScope?: InputMaybe<CodeCriteriaScope>;
  criterias?: InputMaybe<Array<InputMaybe<CodeCriteria>>>;
  locale?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  codeTypes: Array<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryHistoryByQueryArgs = {
  userId: Scalars['String'];
};


export type QueryHistoryByActivityIdArgs = {
  userId: Scalars['String'];
};


export type QueryIndividualByIdArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryIndividualsByNameArgs = {
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  criteria: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryLabelsByCodeArgs = {
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  criteria?: InputMaybe<Scalars['String']>;
  locale?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  codeTypes: Array<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryListAudiencesArgs = {
  locale?: InputMaybe<Scalars['String']>;
};


export type QueryListCountryArgs = {
  locale?: InputMaybe<Scalars['String']>;
};


export type QueryWorkplaceByIdArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryAutocompleteArgs = {
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  criteria: Scalars['String'];
  criteriaScope?: InputMaybe<AutocompleteCriteriaScope>;
  locale?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<GeopointQuery>;
  country?: InputMaybe<Scalars['String']>;
  county?: InputMaybe<CountyQuery>;
  city?: InputMaybe<CityQuery>;
  specialties?: InputMaybe<Array<Scalars['String']>>;
  medTerms?: InputMaybe<Array<Scalars['String']>>;
  addresses?: InputMaybe<Array<Scalars['String']>>;
};


export type QueryReviewsByIndividualArgs = {
  idnat: Scalars['String'];
};

export type Review = {
  __typename?: 'Review';
  createdAt?: Maybe<Scalars['String']>;
  reviewer?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  validatedAt?: Maybe<Scalars['String']>;
  diseases?: Maybe<Array<Maybe<Disease>>>;
};

export type ReviewResult = {
  __typename?: 'ReviewResult';
  rpps?: Maybe<Scalars['String']>;
  idnat?: Maybe<Scalars['String']>;
  adeli?: Maybe<Scalars['String']>;
  diseases?: Maybe<Array<Maybe<Disease>>>;
  reviews?: Maybe<Array<Maybe<Review>>>;
};

export type RevisionRequest = {
  id: Scalars['ID'];
};

export type SubscriptionKey = {
  __typename?: 'SubscriptionKey';
  name?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  countries?: Maybe<Array<Scalars['String']>>;
  professionalTypes?: Maybe<Array<Scalars['String']>>;
  specialties?: Maybe<Array<Scalars['String']>>;
};

export type Translations = {
  __typename?: 'Translations';
  Code?: Maybe<Scalars['String']>;
  Translation?: Maybe<Scalars['String']>;
};

export type Uci = {
  __typename?: 'Uci';
  adeli?: Maybe<Scalars['String']>;
  rpps?: Maybe<Scalars['String']>;
  npi?: Maybe<Scalars['String']>;
  lanr?: Maybe<Scalars['String']>;
  gln?: Maybe<Scalars['String']>;
  zsr?: Maybe<Scalars['String']>;
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

export type ContextKey = {
  __typename?: 'contextKey';
  name?: Maybe<Scalars['String']>;
};
