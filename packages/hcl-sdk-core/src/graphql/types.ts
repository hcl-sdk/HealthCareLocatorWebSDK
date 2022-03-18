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
  fax?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  individual: Individual;
  main_flag?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  role: KeyedString;
  title: KeyedString;
  urls?: Maybe<Array<Maybe<Url>>>;
  webAddress?: Maybe<Scalars['String']>;
  workplace: Workplace;
};

export type ActivityCriteria = {
  scope: ActivityCriteriaScope;
  text: Scalars['String'];
};

/** CriteriaScope enums : Scope of the criteria parameter for a given entity. A scope is a way of using the criteria in a query." */
export enum ActivityCriteriaScope {
  IndividualMedTerms = 'IndividualMedTerms',
  IndividualName = 'IndividualName',
  IndividualNameAutocomplete = 'IndividualNameAutocomplete',
  IndividualSpecialties = 'IndividualSpecialties'
}

export type ActivityFragment = OneKeyEntity & {
  __typename?: 'ActivityFragment';
  fax?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  individual: IndividualFragment;
  phone?: Maybe<Scalars['String']>;
  role: KeyedString;
  title: KeyedString;
  urls?: Maybe<Array<Maybe<Url>>>;
  webAddress?: Maybe<Scalars['String']>;
  workplace: Workplace;
};

export type ActivityList = OneKeyEntity & {
  __typename?: 'ActivityList';
  fax?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  main_flag?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  role: KeyedString;
  title: KeyedString;
  webAddress?: Maybe<Scalars['String']>;
  workplace: Workplace;
};

export type ActivityQueryEntry = {
  __typename?: 'ActivityQueryEntry';
  activity?: Maybe<ActivityFragment>;
  when?: Maybe<Scalars['Date']>;
};

export type ActivityResult = {
  __typename?: 'ActivityResult';
  activity: ActivityFragment;
  distance?: Maybe<Scalars['Float']>;
  relevance?: Maybe<Scalars['Int']>;
};

/** SortScope enums : Scope of the sort for a given entity. A scope is a way of sorting the query results." */
export enum ActivitySortScope {
  IndividualName = 'IndividualName',
  Relevancy = 'Relevancy',
  WorkplaceDistance = 'WorkplaceDistance'
}

/** An international address definition */
export type Address = OneKeyEntity & {
  __typename?: 'Address';
  buildingLabel?: Maybe<Scalars['String']>;
  city: KeyedString;
  country: Scalars['String'];
  county?: Maybe<KeyedString>;
  id: Scalars['ID'];
  location?: Maybe<Geopoint>;
  longLabel: Scalars['String'];
  postalCode: Scalars['String'];
};

export type Audience = {
  __typename?: 'Audience';
  label?: Maybe<Scalars['String']>;
};

export type CityQuery = {
  code?: InputMaybe<Scalars['String']>;
  label?: InputMaybe<Scalars['String']>;
};

export type Code = {
  __typename?: 'Code';
  dbCode?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  lisCode: Scalars['String'];
  lisLbl: Scalars['String'];
  locale?: Maybe<Scalars['String']>;
  longLbl: Scalars['String'];
  /**  This corresponds to the long label */
  shortLbl?: Maybe<Scalars['String']>;
  /** This corresponds to the lis code */
  updateDate?: Maybe<Scalars['String']>;
};

export type CodeCriteria = {
  scope?: InputMaybe<CodeCriteriaScope>;
  text?: InputMaybe<Scalars['String']>;
};

export enum CodeCriteriaScope {
  Id = 'Id',
  LongLbl = 'LongLbl',
  LongLblAutocomplete = 'LongLblAutocomplete'
}

export type CodeResult = {
  __typename?: 'CodeResult';
  codes?: Maybe<Array<Maybe<Code>>>;
};

export type ContextKey = {
  __typename?: 'contextKey';
  name?: Maybe<Scalars['String']>;
};

/** List of countries */
export type Country = {
  __typename?: 'Country';
  code?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
};

export type CountyQuery = {
  code?: InputMaybe<Scalars['String']>;
  label?: InputMaybe<Scalars['String']>;
};

/** Filter criteria put by User to save History */
export type Criteria = {
  __typename?: 'Criteria';
  county?: Maybe<Scalars['String']>;
  criteria?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  log?: Maybe<Scalars['String']>;
  professionalType?: Maybe<Scalars['String']>;
  radius?: Maybe<Scalars['String']>;
};

export type DailyOpenHours = {
  __typename?: 'DailyOpenHours';
  day?: Maybe<Day>;
  openPeriods: OpenPeriod;
};

export type DataQualityAssessment = {
  comment?: InputMaybe<Scalars['String']>;
  grade: Scalars['String'];
};

export enum Day {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
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
  distanceMeter?: InputMaybe<Scalars['Float']>;
  lat: Scalars['Float'];
  lon: Scalars['Float'];
};

export type HistoryActivityResult = {
  __typename?: 'HistoryActivityResult';
  activityId?: Maybe<Scalars['String']>;
  subscriptionId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  when?: Maybe<Scalars['String']>;
};

/** History Query model is to save 5 search criteria for User */
export type HistoryQueryResult = {
  __typename?: 'HistoryQueryResult';
  filterCriteria?: Maybe<Criteria>;
  queryId?: Maybe<Scalars['String']>;
  subscriptionId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  when?: Maybe<Scalars['String']>;
};

export type Individual = OneKeyEntity & {
  __typename?: 'Individual';
  chTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  diseasesAvailable?: Maybe<Scalars['Boolean']>;
  firstName?: Maybe<Scalars['String']>;
  firstNameInitials?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  kvTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  lastName: Scalars['String'];
  maidenName?: Maybe<Scalars['String']>;
  mailingName?: Maybe<Scalars['String']>;
  mainActivity: ActivityList;
  meshTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  middleName?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  otherActivities: Array<ActivityList>;
  professionalType: KeyedString;
  reviewsAvailable?: Maybe<Scalars['Boolean']>;
  specialties: Array<KeyedString>;
  suffixName?: Maybe<Scalars['String']>;
  title: KeyedString;
  uci?: Maybe<Uci>;
  webAddress?: Maybe<Scalars['String']>;
};

export type IndividualFragment = OneKeyEntity & {
  __typename?: 'IndividualFragment';
  chTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  diseasesAvailable?: Maybe<Scalars['Boolean']>;
  firstName?: Maybe<Scalars['String']>;
  firstNameInitials?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  kvTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  lastName: Scalars['String'];
  maidenName?: Maybe<Scalars['String']>;
  mailingName?: Maybe<Scalars['String']>;
  meshTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  middleName?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  professionalType: KeyedString;
  reviewsAvailable?: Maybe<Scalars['Boolean']>;
  specialties: Array<KeyedString>;
  suffixName?: Maybe<Scalars['String']>;
  title: KeyedString;
  uci?: Maybe<Uci>;
  webAddress?: Maybe<Scalars['String']>;
};

export type IndividualResult = {
  __typename?: 'IndividualResult';
  individuals?: Maybe<Array<Maybe<IndividualWorkPlaceDetails>>>;
};

export type IndividualSuggestFragment = OneKeyEntity & {
  __typename?: 'IndividualSuggestFragment';
  activity?: Maybe<ActivityList>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  intlSpecialties?: Maybe<Array<Maybe<KeyedString>>>;
  lastName?: Maybe<Scalars['String']>;
  medTerms?: Maybe<Array<Maybe<KeyedString>>>;
  middleName?: Maybe<Scalars['String']>;
  specialties?: Maybe<Array<Maybe<KeyedString>>>;
  title?: Maybe<KeyedString>;
};

export type IndividualWorkPlaceDetails = OneKeyEntity & {
  __typename?: 'IndividualWorkPlaceDetails';
  firstName?: Maybe<Scalars['String']>;
  firstNameInitials?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName: Scalars['String'];
  maidenName?: Maybe<Scalars['String']>;
  mailingName?: Maybe<Scalars['String']>;
  mainActivity: Activity;
  middleName?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  professionalType: KeyedString;
  specialties: Array<KeyedString>;
  suffixName?: Maybe<Scalars['String']>;
  title: KeyedString;
  webAddress?: Maybe<Scalars['String']>;
};

/** A type for String that can be expressed as a Key. */
export type KeyedString = {
  __typename?: 'KeyedString';
  /** A unique key that can be used to identify this string */
  code: Scalars['String'];
  /** Contains the label corresponding to this key expressed in the requested locale ( refer to query ) */
  label: Scalars['String'];
};

/** GraphQL operations */
export type Mutation = {
  __typename?: 'Mutation';
  ForgetHistoryActivityEntries?: Maybe<Scalars['String']>;
  ForgetHistoryQueryEntry?: Maybe<Scalars['String']>;
  postDataQualityAssesmentForActivity?: Maybe<Scalars['String']>;
  postRevisionRequest?: Maybe<Scalars['String']>;
};


/** GraphQL operations */
export type MutationForgetHistoryActivityEntriesArgs = {
  activityId: Scalars['ID'];
};


/** GraphQL operations */
export type MutationForgetHistoryQueryEntryArgs = {
  query: Scalars['ID'];
};


/** GraphQL operations */
export type MutationPostDataQualityAssesmentForActivityArgs = {
  activityId: Scalars['ID'];
  grade: DataQualityAssessment;
  userId?: InputMaybe<Scalars['String']>;
};


/** GraphQL operations */
export type MutationPostRevisionRequestArgs = {
  request: RevisionRequest;
};

/** A basic shape for all OneKey main entities */
export type OneKeyEntity = {
  /** A globally unique Id for the entity */
  id: Scalars['ID'];
};

export type OpenPeriod = {
  __typename?: 'OpenPeriod';
  close?: Maybe<Scalars['String']>;
  open?: Maybe<Scalars['String']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
};

export enum QualityGrade {
  Nok = 'NOK',
  Ok = 'OK'
}

export type QualityReport = {
  __typename?: 'QualityReport';
  activityId?: Maybe<Scalars['String']>;
  apiKey?: Maybe<Scalars['String']>;
  comments?: Maybe<Scalars['String']>;
  grade?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  activities?: Maybe<Array<Maybe<ActivityResult>>>;
  activityByID?: Maybe<Activity>;
  codesByLabel?: Maybe<CodeResult>;
  historyBYActivityId?: Maybe<Array<Maybe<HistoryActivityResult>>>;
  historyBYQuery?: Maybe<Array<Maybe<HistoryQueryResult>>>;
  individualByID?: Maybe<Individual>;
  individualsByName?: Maybe<IndividualResult>;
  labelsByCode?: Maybe<CodeResult>;
  listAudiences?: Maybe<Array<Maybe<Audience>>>;
  listCountry?: Maybe<Array<Maybe<Country>>>;
  mySubscriptionKey?: Maybe<SubscriptionKey>;
  reviewsByIndividual?: Maybe<ReviewResult>;
  suggest?: Maybe<SuggestResult>;
  workplaceById?: Maybe<Workplace>;
  workplaces?: Maybe<WorkplaceResults>;
};


export type QueryActivitiesArgs = {
  country?: InputMaybe<Scalars['String']>;
  county?: InputMaybe<Scalars['String']>;
  criteria?: InputMaybe<Scalars['String']>;
  criterias?: InputMaybe<Array<InputMaybe<ActivityCriteria>>>;
  criteriaScope?: InputMaybe<ActivityCriteriaScope>;
  first?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<GeopointQuery>;
  medTerms?: InputMaybe<Array<Scalars['String']>>;
  offset?: InputMaybe<Scalars['Int']>;
  professionalType?: InputMaybe<Scalars['String']>;
  sorts?: InputMaybe<Array<InputMaybe<ActivitySortScope>>>;
  sortScope?: InputMaybe<ActivitySortScope>;
  specialties?: InputMaybe<Array<Scalars['String']>>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryActivityByIdArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryCodesByLabelArgs = {
  codeTypes: Array<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  criteria?: InputMaybe<Scalars['String']>;
  criterias?: InputMaybe<Array<InputMaybe<CodeCriteria>>>;
  criteriaScope?: InputMaybe<CodeCriteriaScope>;
  first?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryHistoryByActivityIdArgs = {
  userId: Scalars['String'];
};


export type QueryHistoryByQueryArgs = {
  userId: Scalars['String'];
};


export type QueryIndividualByIdArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryIndividualsByNameArgs = {
  country?: InputMaybe<Scalars['String']>;
  criteria: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryLabelsByCodeArgs = {
  codeTypes: Array<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  criteria?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryListAudiencesArgs = {
  locale?: InputMaybe<Scalars['String']>;
};


export type QueryListCountryArgs = {
  locale?: InputMaybe<Scalars['String']>;
};


export type QueryReviewsByIndividualArgs = {
  idnat: Scalars['String'];
};


export type QuerySuggestArgs = {
  addresses?: InputMaybe<Array<Scalars['String']>>;
  city?: InputMaybe<CityQuery>;
  country?: InputMaybe<Scalars['String']>;
  county?: InputMaybe<CountyQuery>;
  criteria?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  individuals?: InputMaybe<Array<Scalars['String']>>;
  locale?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<GeopointQuery>;
  medTerms?: InputMaybe<Array<Scalars['String']>>;
  offset?: InputMaybe<Scalars['Int']>;
  scope?: InputMaybe<SuggestScope>;
  specialties?: InputMaybe<Array<Scalars['String']>>;
};


export type QueryWorkplaceByIdArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryWorkplacesArgs = {
  country?: InputMaybe<Scalars['String']>;
  county?: InputMaybe<Scalars['String']>;
  criteria?: InputMaybe<Scalars['String']>;
  criterias?: InputMaybe<Array<InputMaybe<WorkplaceCriteria>>>;
  criteriaScope?: InputMaybe<WorkplaceCriteriaScope>;
  first?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<GeopointQuery>;
  offset?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<InputMaybe<WorkplaceSortScope>>>;
  sortScope?: InputMaybe<WorkplaceSortScope>;
};

export type Review = {
  __typename?: 'Review';
  createdAt?: Maybe<Scalars['String']>;
  diseases?: Maybe<Array<Maybe<Disease>>>;
  reviewer?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  validatedAt?: Maybe<Scalars['String']>;
};

export type ReviewResult = {
  __typename?: 'ReviewResult';
  adeli?: Maybe<Scalars['String']>;
  diseases?: Maybe<Array<Maybe<Disease>>>;
  idnat?: Maybe<Scalars['String']>;
  reviews?: Maybe<Array<Maybe<Review>>>;
  rpps?: Maybe<Scalars['String']>;
};

export type RevisionRequest = {
  id: Scalars['ID'];
};

/** Subscription types : Informations related to an user subscription." */
export type SubscriptionKey = {
  __typename?: 'SubscriptionKey';
  company?: Maybe<Scalars['String']>;
  countries?: Maybe<Array<Scalars['String']>>;
  name?: Maybe<Scalars['String']>;
  professionalTypes?: Maybe<Array<Scalars['String']>>;
  specialties?: Maybe<Array<Scalars['String']>>;
};

export type SuggestFragment = {
  __typename?: 'SuggestFragment';
  address?: Maybe<Address>;
  individual?: Maybe<IndividualSuggestFragment>;
  medTerm?: Maybe<KeyedString>;
  specialty?: Maybe<KeyedString>;
  workplace?: Maybe<WorkplaceSuggestFragment>;
};

export type SuggestResult = {
  __typename?: 'SuggestResult';
  from?: Maybe<Scalars['Int']>;
  results?: Maybe<Array<Maybe<SuggestFragment>>>;
  size?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export enum SuggestScope {
  Address = 'Address',
  Individual = 'Individual',
  MedTerm = 'MedTerm',
  Specialty = 'Specialty',
  Workplace = 'Workplace'
}

/** This object represents an Individual's activity at a specific Workplace. */
export type Translations = {
  __typename?: 'Translations';
  Code?: Maybe<Scalars['String']>;
  Translation?: Maybe<Scalars['String']>;
};

export type Uci = {
  __typename?: 'Uci';
  /** FR UCI 'ADDELI' */
  adeli?: Maybe<Scalars['String']>;
  /** CH UCI 'GLN' */
  gln?: Maybe<Scalars['String']>;
  /** DE UCI 'LANR' */
  lanr?: Maybe<Scalars['String']>;
  /** US UCI 'NPI' */
  npi?: Maybe<Scalars['String']>;
  /** FR UCI 'RPPS' */
  rpps?: Maybe<Scalars['String']>;
  /** CH UCI 'ZSR' */
  zsr?: Maybe<Scalars['String']>;
};

export type Url = {
  __typename?: 'Url';
  application?: Maybe<Scalars['String']>;
  url?: Maybe<UrlDetail>;
};

export type UrlDetail = {
  __typename?: 'UrlDetail';
  generated?: Maybe<Scalars['String']>;
  webcrawled?: Maybe<Scalars['String']>;
};

/** A physical location where an activity takes place */
export type Workplace = OneKeyEntity & {
  __typename?: 'Workplace';
  address: Address;
  emailAddress?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  intlFax?: Maybe<Scalars['String']>;
  intlPhone?: Maybe<Scalars['String']>;
  localPhone?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  officialName?: Maybe<Scalars['String']>;
  openHours?: Maybe<Array<Maybe<DailyOpenHours>>>;
  parentId?: Maybe<Scalars['String']>;
  type: KeyedString;
  webAddress?: Maybe<Scalars['String']>;
};

export type WorkplaceCriteria = {
  scope: WorkplaceCriteriaScope;
  text: Scalars['String'];
};

export enum WorkplaceCriteriaScope {
  Address = 'Address',
  Name = 'Name'
}

export type WorkplaceResult = {
  __typename?: 'WorkplaceResult';
  distance?: Maybe<Scalars['Float']>;
  relevance?: Maybe<Scalars['Int']>;
  workplace: WorkplaceWithIndividuals;
};

export type WorkplaceResults = {
  __typename?: 'WorkplaceResults';
  from?: Maybe<Scalars['Int']>;
  results?: Maybe<Array<Maybe<WorkplaceResult>>>;
  size?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export enum WorkplaceSortScope {
  Distance = 'Distance',
  Name = 'Name',
  Relevancy = 'Relevancy'
}

export type WorkplaceSuggestFragment = OneKeyEntity & {
  __typename?: 'WorkplaceSuggestFragment';
  emailAddress?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  intlFax?: Maybe<Scalars['String']>;
  intlPhone?: Maybe<Scalars['String']>;
  localPhone?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  officialName?: Maybe<Scalars['String']>;
  openHours?: Maybe<Array<Maybe<DailyOpenHours>>>;
  type?: Maybe<KeyedString>;
  webAddress?: Maybe<Scalars['String']>;
};

export type WorkplaceWithIndividuals = OneKeyEntity & {
  __typename?: 'WorkplaceWithIndividuals';
  address: Address;
  emailAddress?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  individuals?: Maybe<Array<Maybe<Individual>>>;
  intlFax?: Maybe<Scalars['String']>;
  intlPhone?: Maybe<Scalars['String']>;
  localPhone?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  officialName?: Maybe<Scalars['String']>;
  openHours?: Maybe<Array<Maybe<DailyOpenHours>>>;
  parentId?: Maybe<Scalars['String']>;
  type: KeyedString;
  webAddress?: Maybe<Scalars['String']>;
};

export type ActivitiesQueryVariables = Exact<{
  first: Scalars['Int'];
  offset: Scalars['Int'];
  specialties?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  county?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<GeopointQuery>;
  criteria?: InputMaybe<Scalars['String']>;
  criterias?: InputMaybe<Array<InputMaybe<ActivityCriteria>> | InputMaybe<ActivityCriteria>>;
  medTerms?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  criteriaScope?: InputMaybe<ActivityCriteriaScope>;
  sorts?: InputMaybe<Array<InputMaybe<ActivitySortScope>> | InputMaybe<ActivitySortScope>>;
  locale?: InputMaybe<Scalars['String']>;
}>;


export type ActivitiesQuery = { __typename?: 'Query', activities?: Array<{ __typename?: 'ActivityResult', distance?: number | null | undefined, relevance?: number | null | undefined, activity: { __typename?: 'ActivityFragment', id: string, urls?: Array<{ __typename?: 'Url', url?: { __typename?: 'UrlDetail', generated?: string | null | undefined, webcrawled?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined, individual: { __typename?: 'IndividualFragment', id: string, firstName?: string | null | undefined, lastName: string, middleName?: string | null | undefined, meshTerms?: Array<string | null | undefined> | null | undefined, kvTerms?: Array<string | null | undefined> | null | undefined, chTerms?: Array<string | null | undefined> | null | undefined, reviewsAvailable?: boolean | null | undefined, diseasesAvailable?: boolean | null | undefined, professionalType: { __typename?: 'KeyedString', label: string }, specialties: Array<{ __typename?: 'KeyedString', code: string, label: string }>, uci?: { __typename?: 'Uci', rpps?: string | null | undefined, adeli?: string | null | undefined } | null | undefined }, workplace: { __typename?: 'Workplace', id: string, openHours?: Array<{ __typename?: 'DailyOpenHours', day?: Day | null | undefined, openPeriods: { __typename?: 'OpenPeriod', open?: string | null | undefined, close?: string | null | undefined } } | null | undefined> | null | undefined, address: { __typename?: 'Address', longLabel: string, buildingLabel?: string | null | undefined, postalCode: string, country: string, county?: { __typename?: 'KeyedString', label: string } | null | undefined, city: { __typename?: 'KeyedString', label: string }, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } } } } | null | undefined> | null | undefined };

export type ActivityByIdQueryVariables = Exact<{
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
}>;


export type ActivityByIdQuery = { __typename?: 'Query', activityByID?: { __typename?: 'Activity', id: string, phone?: string | null | undefined, fax?: string | null | undefined, webAddress?: string | null | undefined, urls?: Array<{ __typename?: 'Url', url?: { __typename?: 'UrlDetail', generated?: string | null | undefined, webcrawled?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined, role: { __typename?: 'KeyedString', code: string, label: string }, workplace: { __typename?: 'Workplace', id: string, name: string, intlPhone?: string | null | undefined, intlFax?: string | null | undefined, localPhone?: string | null | undefined, openHours?: Array<{ __typename?: 'DailyOpenHours', day?: Day | null | undefined, openPeriods: { __typename?: 'OpenPeriod', open?: string | null | undefined, close?: string | null | undefined } } | null | undefined> | null | undefined, address: { __typename?: 'Address', longLabel: string, country: string, postalCode: string, buildingLabel?: string | null | undefined, county?: { __typename?: 'KeyedString', label: string } | null | undefined, city: { __typename?: 'KeyedString', label: string }, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } }, individual: { __typename?: 'Individual', id: string, firstName?: string | null | undefined, lastName: string, middleName?: string | null | undefined, mailingName?: string | null | undefined, nickname?: string | null | undefined, suffixName?: string | null | undefined, meshTerms?: Array<string | null | undefined> | null | undefined, kvTerms?: Array<string | null | undefined> | null | undefined, chTerms?: Array<string | null | undefined> | null | undefined, reviewsAvailable?: boolean | null | undefined, diseasesAvailable?: boolean | null | undefined, professionalType: { __typename?: 'KeyedString', label: string }, specialties: Array<{ __typename?: 'KeyedString', code: string, label: string }>, mainActivity: { __typename?: 'ActivityList', id: string, workplace: { __typename?: 'Workplace', address: { __typename?: 'Address', longLabel: string, postalCode: string, buildingLabel?: string | null | undefined, city: { __typename?: 'KeyedString', code: string, label: string } } } }, otherActivities: Array<{ __typename?: 'ActivityList', id: string, workplace: { __typename?: 'Workplace', address: { __typename?: 'Address', longLabel: string, postalCode: string, buildingLabel?: string | null | undefined, city: { __typename?: 'KeyedString', code: string, label: string } } } }>, uci?: { __typename?: 'Uci', rpps?: string | null | undefined, adeli?: string | null | undefined } | null | undefined } } | null | undefined };

export type CodesByLabelQueryVariables = Exact<{
  first: Scalars['Int'];
  offset: Scalars['Int'];
  criteria?: InputMaybe<Scalars['String']>;
  codeTypes: Array<Scalars['String']> | Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  criteriaScope?: InputMaybe<CodeCriteriaScope>;
}>;


export type CodesByLabelQuery = { __typename?: 'Query', codesByLabel?: { __typename?: 'CodeResult', codes?: Array<{ __typename?: 'Code', id?: string | null | undefined, lisCode: string, lisLbl: string, longLbl: string } | null | undefined> | null | undefined } | null | undefined };

export type UrlFragment = { __typename?: 'UrlDetail', generated?: string | null | undefined, webcrawled?: string | null | undefined };

export type IndividualByIdQueryVariables = Exact<{
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
}>;


export type IndividualByIdQuery = { __typename?: 'Query', individualByID?: { __typename?: 'Individual', id: string, firstName?: string | null | undefined, lastName: string, middleName?: string | null | undefined, mailingName?: string | null | undefined, webAddress?: string | null | undefined, specialties: Array<{ __typename?: 'KeyedString', label: string }>, title: { __typename?: 'KeyedString', code: string, label: string }, professionalType: { __typename?: 'KeyedString', label: string }, mainActivity: { __typename?: 'ActivityList', phone?: string | null | undefined, fax?: string | null | undefined, title: { __typename?: 'KeyedString', code: string, label: string }, workplace: { __typename?: 'Workplace', name: string, localPhone?: string | null | undefined, intlFax?: string | null | undefined, webAddress?: string | null | undefined, address: { __typename?: 'Address', postalCode: string, longLabel: string, buildingLabel?: string | null | undefined, country: string, county?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, city: { __typename?: 'KeyedString', code: string, label: string } } } }, otherActivities: Array<{ __typename?: 'ActivityList', phone?: string | null | undefined, fax?: string | null | undefined, title: { __typename?: 'KeyedString', code: string, label: string }, workplace: { __typename?: 'Workplace', name: string, localPhone?: string | null | undefined, intlFax?: string | null | undefined, webAddress?: string | null | undefined, address: { __typename?: 'Address', postalCode: string, longLabel: string, buildingLabel?: string | null | undefined, country: string, county?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, city: { __typename?: 'KeyedString', code: string, label: string } } } }> } | null | undefined };

export type IndividualsByNameQueryVariables = Exact<{
  first: Scalars['Int'];
  offset: Scalars['Int'];
  criteria: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
}>;


export type IndividualsByNameQuery = { __typename?: 'Query', individualsByName?: { __typename?: 'IndividualResult', individuals?: Array<{ __typename?: 'IndividualWorkPlaceDetails', id: string, firstName?: string | null | undefined, middleName?: string | null | undefined, lastName: string, professionalType: { __typename?: 'KeyedString', label: string }, specialties: Array<{ __typename?: 'KeyedString', label: string }>, mainActivity: { __typename?: 'Activity', id: string, workplace: { __typename?: 'Workplace', address: { __typename?: 'Address', longLabel: string, country: string, postalCode: string, county?: { __typename?: 'KeyedString', label: string } | null | undefined, city: { __typename?: 'KeyedString', label: string }, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } } } } | null | undefined> | null | undefined } | null | undefined };

export type LabelsByCodeQueryVariables = Exact<{
  first: Scalars['Int'];
  offset?: InputMaybe<Scalars['Int']>;
  criteria?: InputMaybe<Scalars['String']>;
  codeTypes: Array<Scalars['String']> | Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
}>;


export type LabelsByCodeQuery = { __typename?: 'Query', labelsByCode?: { __typename?: 'CodeResult', codes?: Array<{ __typename?: 'Code', id?: string | null | undefined, lisCode: string, lisLbl: string, longLbl: string } | null | undefined> | null | undefined } | null | undefined };

export type MySubscriptionKeyQueryVariables = Exact<{ [key: string]: never; }>;


export type MySubscriptionKeyQuery = { __typename?: 'Query', mySubscriptionKey?: { __typename?: 'SubscriptionKey', countries?: Array<string> | null | undefined } | null | undefined };

export type ReviewsByIndividualQueryVariables = Exact<{
  idnat: Scalars['String'];
}>;


export type ReviewsByIndividualQuery = { __typename?: 'Query', reviewsByIndividual?: { __typename?: 'ReviewResult', rpps?: string | null | undefined, adeli?: string | null | undefined, idnat?: string | null | undefined, diseases?: Array<{ __typename?: 'Disease', id?: number | null | undefined, name?: string | null | undefined } | null | undefined> | null | undefined, reviews?: Array<{ __typename?: 'Review', text?: string | null | undefined, reviewer?: string | null | undefined, createdAt?: string | null | undefined, diseases?: Array<{ __typename?: 'Disease', id?: number | null | undefined, name?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type SuggestQueryVariables = Exact<{
  criteria?: InputMaybe<Scalars['String']>;
  scope?: InputMaybe<SuggestScope>;
  country?: InputMaybe<Scalars['String']>;
  specialties?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  medTerms?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  location?: InputMaybe<GeopointQuery>;
  locale?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type SuggestQuery = { __typename?: 'Query', suggest?: { __typename?: 'SuggestResult', from?: number | null | undefined, size?: number | null | undefined, total?: number | null | undefined, results?: Array<{ __typename?: 'SuggestFragment', individual?: { __typename?: 'IndividualSuggestFragment', firstName?: string | null | undefined, lastName?: string | null | undefined, activity?: { __typename?: 'ActivityList', id: string, workplace: { __typename?: 'Workplace', address: { __typename?: 'Address', longLabel: string, postalCode: string, county?: { __typename?: 'KeyedString', label: string } | null | undefined, city: { __typename?: 'KeyedString', label: string }, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } } } | null | undefined, specialties?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined, medTerms?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined } | null | undefined, address?: { __typename?: 'Address', longLabel: string, country: string } | null | undefined, specialty?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, medTerm?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type WorkplacesV2QueryVariables = Exact<{
  first: Scalars['Int'];
  offset: Scalars['Int'];
  criteria?: InputMaybe<Scalars['String']>;
  criterias?: InputMaybe<Array<InputMaybe<WorkplaceCriteria>> | InputMaybe<WorkplaceCriteria>>;
  criteriaScope?: InputMaybe<WorkplaceCriteriaScope>;
  country?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<GeopointQuery>;
  locale?: InputMaybe<Scalars['String']>;
}>;


export type QueryWorkplaceByIdv2Args = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
};

export type WorkplaceByIdv2QueryVariables = Exact<{
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
}>;

export type WorkplaceByIdv2Query = { __typename?: 'Query', workplaceByIDV2?: { __typename?: 'Workplace', id: string, name: string, officialName?: string | null | undefined, intlPhone?: string | null | undefined, intlFax?: string | null | undefined, webAddress?: string | null | undefined, individuals?: Array<{ __typename?: 'Individual', id: string, firstName?: string | null | undefined, lastName?: string | null | undefined, middleName?: string | null | undefined, reviewsAvailable?: boolean | null | undefined, diseasesAvailable?: boolean | null | undefined, mainActivity?: { __typename?: 'Activity', id: string, urls?: Array<{ __typename?: 'Url', url?: { __typename?: 'UrlDetail', generated?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined, specialties?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined } | null | undefined> | null | undefined, type: { __typename?: 'KeyedString', code: string, label: string }, address: { __typename?: 'Address', longLabel: string, country: string, postalCode: string, city: { __typename?: 'KeyedString', label: string }, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } } | null | undefined };

export type WorkplacesV2Query = { __typename?: 'Query', workplacesV2?: { __typename?: 'WorkplacesResult', edges?: Array<{ __typename?: 'WorkplacesResultEdge', distance: number, node: { __typename?: 'Workplace', id: string, name: string, officialName?: string | null | undefined, intlPhone?: string | null | undefined, intlFax?: string | null | undefined, webAddress?: string | null | undefined, type: { __typename?: 'KeyedString', code: string, label: string }, address: { __typename?: 'Address', longLabel: string, country: string, postalCode: string, city: { __typename?: 'KeyedString', label: string }, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined }, individuals?: Array<{ __typename?: 'Individual', firstName?: string | null | undefined, lastName?: string | null | undefined, middleName?: string | null | undefined, reviewsAvailable?: boolean | null | undefined, diseasesAvailable?: boolean | null | undefined, specialties?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined } | null | undefined> | null | undefined } } | null | undefined> | null | undefined } | null | undefined };
