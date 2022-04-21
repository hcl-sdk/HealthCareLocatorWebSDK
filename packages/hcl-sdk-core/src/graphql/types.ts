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

/** Search Results */
export type ActivitiesResult = SearchResult & {
  __typename?: 'ActivitiesResult';
  edges?: Maybe<Array<Maybe<ActivitiesResultEdge>>>;
  pageInfo?: Maybe<PageInfo>;
  totalCount?: Maybe<Scalars['Int']>;
};

/** Search ResultEdges */
export type ActivitiesResultEdge = SearchResultEdge & {
  __typename?: 'ActivitiesResultEdge';
  cursor: Scalars['String'];
  distance: Scalars['Float'];
  node: Activity;
  relevance: Scalars['Float'];
};

/** This object represents an Individual's activity at a specific Workplace. */
export type Activity = OneKeyEntity & SearchResultNode & {
  __typename?: 'Activity';
  fax?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  individual?: Maybe<Individual>;
  main_flag?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  role?: Maybe<KeyedString>;
  title?: Maybe<KeyedString>;
  urls?: Maybe<Array<Maybe<Url>>>;
  webAddress?: Maybe<Scalars['String']>;
  workplace?: Maybe<Workplace>;
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
  city?: Maybe<KeyedString>;
  country?: Maybe<Scalars['String']>;
  county?: Maybe<KeyedString>;
  id: Scalars['ID'];
  location?: Maybe<Geopoint>;
  longLabel?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
};

export type CityQuery = {
  code?: InputMaybe<Scalars['String']>;
  label?: InputMaybe<Scalars['String']>;
};

export type Code = OneKeyEntity & SearchResultNode & {
  __typename?: 'Code';
  dbCode?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
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
  scope: CodeCriteriaScope;
  text: Scalars['String'];
};

export enum CodeCriteriaScope {
  Id = 'Id',
  LongLbl = 'LongLbl',
  LongLblAutocomplete = 'LongLblAutocomplete'
}

export type CodesResult = SearchResult & {
  __typename?: 'CodesResult';
  edges?: Maybe<Array<Maybe<CodesResultEdge>>>;
  pageInfo?: Maybe<PageInfo>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type CodesResultEdge = SearchResultEdge & {
  __typename?: 'CodesResultEdge';
  cursor: Scalars['String'];
  node: Code;
  relevance: Scalars['Float'];
};

/** Search elements */
export type Country = {
  __typename?: 'Country';
  code?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
};

export type CountyQuery = {
  code?: InputMaybe<Scalars['String']>;
  label?: InputMaybe<Scalars['String']>;
};

export type DailyOpenHours = {
  __typename?: 'DailyOpenHours';
  day?: Maybe<Day>;
  openPeriods: OpenPeriod;
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

/** A disease associated with a practitioner or a review */
export type Disease = {
  __typename?: 'Disease';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type Geopoint = {
  __typename?: 'Geopoint';
  lat: Scalars['Float'];
  lon: Scalars['Float'];
};

/** Inputs */
export type GeopointQuery = {
  distanceMeter?: InputMaybe<Scalars['Float']>;
  lat: Scalars['Float'];
  lon: Scalars['Float'];
};

/** A healthcare practitionner practicing the activity */
export type Individual = OneKeyEntity & SearchResultNode & {
  __typename?: 'Individual';
  chTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  diseasesAvailable?: Maybe<Scalars['Boolean']>;
  firstName?: Maybe<Scalars['String']>;
  firstNameInitials?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  kvTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  lastName?: Maybe<Scalars['String']>;
  maidenName?: Maybe<Scalars['String']>;
  mailingName?: Maybe<Scalars['String']>;
  mainActivity?: Maybe<Activity>;
  meshTerms?: Maybe<Array<Maybe<Scalars['String']>>>;
  middleName?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  otherActivities?: Maybe<Array<Maybe<Activity>>>;
  professionalType?: Maybe<KeyedString>;
  reviewsAvailable?: Maybe<Scalars['Boolean']>;
  specialties?: Maybe<Array<Maybe<KeyedString>>>;
  suffixName?: Maybe<Scalars['String']>;
  title?: Maybe<KeyedString>;
  uci?: Maybe<Uci>;
  webAddress?: Maybe<Scalars['String']>;
};

export type IndividualCriteria = {
  scope: IndividualCriteriaScope;
  text: Scalars['String'];
};

export enum IndividualCriteriaScope {
  MedTerms = 'MedTerms',
  Name = 'Name',
  Specialties = 'Specialties'
}

export enum IndividualSortScope {
  Name = 'Name',
  Relevancy = 'Relevancy'
}

export type IndividualsResult = SearchResult & {
  __typename?: 'IndividualsResult';
  edges?: Maybe<Array<Maybe<IndividualsResultEdge>>>;
  pageInfo?: Maybe<PageInfo>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type IndividualsResultEdge = SearchResultEdge & {
  __typename?: 'IndividualsResultEdge';
  cursor: Scalars['String'];
  node: Individual;
  relevance: Scalars['Float'];
};

export type IndividualSuggestionFragment = OneKeyEntity & {
  __typename?: 'IndividualSuggestionFragment';
  activity?: Maybe<Activity>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  intlSpecialties?: Maybe<Array<Maybe<KeyedString>>>;
  lastName?: Maybe<Scalars['String']>;
  medTerms?: Maybe<Array<Maybe<KeyedString>>>;
  middleName?: Maybe<Scalars['String']>;
  specialties?: Maybe<Array<Maybe<KeyedString>>>;
  title?: Maybe<KeyedString>;
};

/** A type for String that can be expressed as a Key. */
export type KeyedString = {
  __typename?: 'KeyedString';
  /** A unique key that can be used to identify this string */
  code: Scalars['String'];
  /** Contains the label corresponding to this key expressed in the requested locale ( refer to query ) */
  label: Scalars['String'];
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

/** GraphQL operations */
export type Query = {
  __typename?: 'Query';
  activities?: Maybe<ActivitiesResult>;
  activityByID?: Maybe<Activity>;
  codesByLabel?: Maybe<CodesResult>;
  individualByID?: Maybe<Individual>;
  individuals?: Maybe<IndividualsResult>;
  labelsByCode?: Maybe<CodesResult>;
  mySubscriptionKey?: Maybe<SubscriptionKey>;
  reviews?: Maybe<ReviewsResult>;
  suggestions?: Maybe<SuggestionsResult>;
  workplaceByID?: Maybe<Workplace>;
  workplaces?: Maybe<WorkplacesResult>;
};


/** GraphQL operations */
export type QueryActivitiesArgs = {
  country?: InputMaybe<Scalars['String']>;
  county?: InputMaybe<Scalars['String']>;
  criteria?: InputMaybe<Scalars['String']>;
  criterias?: InputMaybe<Array<InputMaybe<ActivityCriteria>>>;
  criteriaScope?: InputMaybe<ActivityCriteriaScope>;
  first?: InputMaybe<Scalars['Int']>;
  individuals?: InputMaybe<Array<Scalars['String']>>;
  locale?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<GeopointQuery>;
  mainFlag?: InputMaybe<Scalars['String']>;
  medTerms?: InputMaybe<Array<Scalars['String']>>;
  offset?: InputMaybe<Scalars['Int']>;
  professionalType?: InputMaybe<Scalars['String']>;
  sorts?: InputMaybe<Array<InputMaybe<ActivitySortScope>>>;
  sortScope?: InputMaybe<ActivitySortScope>;
  specialties?: InputMaybe<Array<Scalars['String']>>;
  workplaces?: InputMaybe<Array<Scalars['String']>>;
};


/** GraphQL operations */
export type QueryActivityByIdArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
};


/** GraphQL operations */
export type QueryCodesByLabelArgs = {
  codeTypes: Array<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  criteria?: InputMaybe<Scalars['String']>;
  criterias?: InputMaybe<Array<InputMaybe<CodeCriteria>>>;
  criteriaScope?: InputMaybe<CodeCriteriaScope>;
  first?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** GraphQL operations */
export type QueryIndividualByIdArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
};


/** GraphQL operations */
export type QueryIndividualsArgs = {
  country?: InputMaybe<Scalars['String']>;
  criteria?: InputMaybe<Scalars['String']>;
  criterias?: InputMaybe<Array<InputMaybe<IndividualCriteria>>>;
  criteriaScope?: InputMaybe<IndividualCriteriaScope>;
  first?: InputMaybe<Scalars['Int']>;
  individuals?: InputMaybe<Array<Scalars['String']>>;
  locale?: InputMaybe<Scalars['String']>;
  medTerms?: InputMaybe<Array<Scalars['String']>>;
  offset?: InputMaybe<Scalars['Int']>;
  professionalType?: InputMaybe<Scalars['String']>;
  sorts?: InputMaybe<Array<InputMaybe<IndividualSortScope>>>;
  sortScope?: InputMaybe<IndividualSortScope>;
  specialties?: InputMaybe<Array<Scalars['String']>>;
  workplaces?: InputMaybe<Array<Scalars['String']>>;
};


/** GraphQL operations */
export type QueryLabelsByCodeArgs = {
  codeTypes: Array<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  criteria?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** GraphQL operations */
export type QueryReviewsArgs = {
  idnat: Scalars['String'];
};


/** GraphQL operations */
export type QuerySuggestionsArgs = {
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
  scope?: InputMaybe<SuggestionScope>;
  specialties?: InputMaybe<Array<Scalars['String']>>;
  workplaces?: InputMaybe<Array<Scalars['String']>>;
};


/** GraphQL operations */
export type QueryWorkplaceByIdArgs = {
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
};


/** GraphQL operations */
export type QueryWorkplacesArgs = {
  country?: InputMaybe<Scalars['String']>;
  county?: InputMaybe<Scalars['String']>;
  criteria?: InputMaybe<Scalars['String']>;
  criterias?: InputMaybe<Array<InputMaybe<WorkplaceCriteria>>>;
  criteriaScope?: InputMaybe<WorkplaceCriteriaScope>;
  first?: InputMaybe<Scalars['Int']>;
  individuals?: InputMaybe<Array<Scalars['String']>>;
  locale?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<GeopointQuery>;
  medTerms?: InputMaybe<Array<Scalars['String']>>;
  offset?: InputMaybe<Scalars['Int']>;
  parent?: InputMaybe<Scalars['String']>;
  professionalType?: InputMaybe<Scalars['String']>;
  sorts?: InputMaybe<Array<InputMaybe<WorkplaceSortScope>>>;
  sortScope?: InputMaybe<WorkplaceSortScope>;
  specialties?: InputMaybe<Array<Scalars['String']>>;
  workplaces?: InputMaybe<Array<Scalars['String']>>;
};

/** A review associated with a practitioner */
export type Review = {
  __typename?: 'Review';
  createdAt?: Maybe<Scalars['String']>;
  diseases?: Maybe<Array<Maybe<Disease>>>;
  reviewer?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  validatedAt?: Maybe<Scalars['String']>;
};

export type ReviewsResult = {
  __typename?: 'ReviewsResult';
  adeli?: Maybe<Scalars['String']>;
  diseases?: Maybe<Array<Maybe<Disease>>>;
  idnat?: Maybe<Scalars['String']>;
  reviews?: Maybe<Array<Maybe<Review>>>;
  rpps?: Maybe<Scalars['String']>;
};

/** Generic search interfaces */
export type SearchResult = {
  edges?: Maybe<Array<Maybe<SearchResultEdge>>>;
  pageInfo?: Maybe<PageInfo>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type SearchResultEdge = {
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<SearchResultNode>;
  relevance?: Maybe<Scalars['Float']>;
};

export type SearchResultNode = {
  /** A globally unique Id for Node */
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

export type Suggestion = SearchResultNode & {
  __typename?: 'Suggestion';
  address?: Maybe<Address>;
  id: Scalars['ID'];
  individual?: Maybe<IndividualSuggestionFragment>;
  medTerm?: Maybe<KeyedString>;
  specialty?: Maybe<KeyedString>;
  workplace?: Maybe<WorkplaceSuggestionFragment>;
};

export enum SuggestionScope {
  Address = 'Address',
  Individual = 'Individual',
  MedTerm = 'MedTerm',
  Specialty = 'Specialty',
  Workplace = 'Workplace'
}

export type SuggestionsResult = SearchResult & {
  __typename?: 'SuggestionsResult';
  edges?: Maybe<Array<Maybe<SuggestionsResultEdge>>>;
  pageInfo?: Maybe<PageInfo>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type SuggestionsResultEdge = SearchResultEdge & {
  __typename?: 'SuggestionsResultEdge';
  cursor: Scalars['String'];
  node: Suggestion;
  relevance: Scalars['Float'];
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
export type Workplace = OneKeyEntity & SearchResultNode & {
  __typename?: 'Workplace';
  address?: Maybe<Address>;
  children?: Maybe<Array<Maybe<Workplace>>>;
  childrenIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  emailAddress?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  individuals?: Maybe<Array<Maybe<Individual>>>;
  intlFax?: Maybe<Scalars['String']>;
  intlPhone?: Maybe<Scalars['String']>;
  localPhone?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  officialName?: Maybe<Scalars['String']>;
  openHours?: Maybe<Array<Maybe<DailyOpenHours>>>;
  parent?: Maybe<Workplace>;
  parentId?: Maybe<Scalars['String']>;
  type?: Maybe<KeyedString>;
  webAddress?: Maybe<Scalars['String']>;
};


/** A physical location where an activity takes place */
export type WorkplaceChildrenArgs = {
  criteria?: InputMaybe<Scalars['String']>;
  criteriaScope?: InputMaybe<WorkplaceCriteriaScope>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** A physical location where an activity takes place */
export type WorkplaceIndividualsArgs = {
  criteria?: InputMaybe<Scalars['String']>;
  criteriaScope?: InputMaybe<IndividualCriteriaScope>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type WorkplaceCriteria = {
  scope: WorkplaceCriteriaScope;
  text: Scalars['String'];
};

export enum WorkplaceCriteriaScope {
  Address = 'Address',
  Name = 'Name'
}

export enum WorkplaceSortScope {
  Distance = 'Distance',
  Name = 'Name',
  Relevancy = 'Relevancy'
}

export type WorkplacesResult = SearchResult & {
  __typename?: 'WorkplacesResult';
  edges?: Maybe<Array<Maybe<WorkplacesResultEdge>>>;
  pageInfo?: Maybe<PageInfo>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type WorkplacesResultEdge = SearchResultEdge & {
  __typename?: 'WorkplacesResultEdge';
  cursor: Scalars['String'];
  distance: Scalars['Float'];
  node: Workplace;
  relevance: Scalars['Float'];
};

export type WorkplaceSuggestionFragment = OneKeyEntity & {
  __typename?: 'WorkplaceSuggestionFragment';
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


export type ActivitiesQuery = { __typename?: 'Query', activities?: { __typename?: 'ActivitiesResult', edges?: Array<{ __typename?: 'ActivitiesResultEdge', distance: number, relevance: number, node: { __typename?: 'Activity', id: string, urls?: Array<{ __typename?: 'Url', url?: { __typename?: 'UrlDetail', generated?: string | null | undefined, webcrawled?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined, individual?: { __typename?: 'Individual', id: string, firstName?: string | null | undefined, lastName?: string | null | undefined, middleName?: string | null | undefined, meshTerms?: Array<string | null | undefined> | null | undefined, kvTerms?: Array<string | null | undefined> | null | undefined, chTerms?: Array<string | null | undefined> | null | undefined, reviewsAvailable?: boolean | null | undefined, diseasesAvailable?: boolean | null | undefined, professionalType?: { __typename?: 'KeyedString', label: string } | null | undefined, specialties?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined, uci?: { __typename?: 'Uci', rpps?: string | null | undefined, adeli?: string | null | undefined } | null | undefined } | null | undefined, workplace?: { __typename?: 'Workplace', id: string, openHours?: Array<{ __typename?: 'DailyOpenHours', day?: Day | null | undefined, openPeriods: { __typename?: 'OpenPeriod', open?: string | null | undefined, close?: string | null | undefined } } | null | undefined> | null | undefined, address?: { __typename?: 'Address', longLabel?: string | null | undefined, buildingLabel?: string | null | undefined, postalCode?: string | null | undefined, country?: string | null | undefined, county?: { __typename?: 'KeyedString', label: string } | null | undefined, city?: { __typename?: 'KeyedString', label: string } | null | undefined, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } | null | undefined } | null | undefined } } | null | undefined> | null | undefined } | null | undefined };

export type ActivityByIdQueryVariables = Exact<{
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
}>;


export type ActivityByIdQuery = { __typename?: 'Query', activityByID?: { __typename?: 'Activity', id: string, phone?: string | null | undefined, fax?: string | null | undefined, webAddress?: string | null | undefined, urls?: Array<{ __typename?: 'Url', url?: { __typename?: 'UrlDetail', generated?: string | null | undefined, webcrawled?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined, role?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, workplace?: { __typename?: 'Workplace', id: string, name?: string | null | undefined, intlPhone?: string | null | undefined, intlFax?: string | null | undefined, localPhone?: string | null | undefined, openHours?: Array<{ __typename?: 'DailyOpenHours', day?: Day | null | undefined, openPeriods: { __typename?: 'OpenPeriod', open?: string | null | undefined, close?: string | null | undefined } } | null | undefined> | null | undefined, address?: { __typename?: 'Address', longLabel?: string | null | undefined, country?: string | null | undefined, postalCode?: string | null | undefined, buildingLabel?: string | null | undefined, county?: { __typename?: 'KeyedString', label: string } | null | undefined, city?: { __typename?: 'KeyedString', label: string } | null | undefined, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } | null | undefined } | null | undefined, individual?: { __typename?: 'Individual', id: string, firstName?: string | null | undefined, lastName?: string | null | undefined, middleName?: string | null | undefined, mailingName?: string | null | undefined, nickname?: string | null | undefined, suffixName?: string | null | undefined, meshTerms?: Array<string | null | undefined> | null | undefined, kvTerms?: Array<string | null | undefined> | null | undefined, chTerms?: Array<string | null | undefined> | null | undefined, reviewsAvailable?: boolean | null | undefined, diseasesAvailable?: boolean | null | undefined, professionalType?: { __typename?: 'KeyedString', label: string } | null | undefined, specialties?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined, mainActivity?: { __typename?: 'Activity', id: string, workplace?: { __typename?: 'Workplace', address?: { __typename?: 'Address', longLabel?: string | null | undefined, postalCode?: string | null | undefined, buildingLabel?: string | null | undefined, city?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined } | null | undefined } | null | undefined } | null | undefined, otherActivities?: Array<{ __typename?: 'Activity', id: string, workplace?: { __typename?: 'Workplace', address?: { __typename?: 'Address', longLabel?: string | null | undefined, postalCode?: string | null | undefined, buildingLabel?: string | null | undefined, city?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined } | null | undefined } | null | undefined } | null | undefined> | null | undefined, uci?: { __typename?: 'Uci', rpps?: string | null | undefined, adeli?: string | null | undefined, npi?: string | null | undefined, lanr?: string | null | undefined, gln?: string | null | undefined, zsr?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined };

export type CodesByLabelQueryVariables = Exact<{
  first: Scalars['Int'];
  offset: Scalars['Int'];
  criteria?: InputMaybe<Scalars['String']>;
  codeTypes: Array<Scalars['String']> | Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  criteriaScope?: InputMaybe<CodeCriteriaScope>;
}>;


export type CodesByLabelQuery = { __typename?: 'Query', codesByLabel?: { __typename?: 'CodesResult', edges?: Array<{ __typename?: 'CodesResultEdge', node: { __typename?: 'Code', id: string, lisCode: string, lisLbl: string, longLbl: string } } | null | undefined> | null | undefined } | null | undefined };

export type UrlFragment = { __typename?: 'UrlDetail', generated?: string | null | undefined, webcrawled?: string | null | undefined };

export type WorkplaceCoreFragment = { __typename?: 'Workplace', id: string, name?: string | null | undefined, officialName?: string | null | undefined, intlPhone?: string | null | undefined, intlFax?: string | null | undefined, webAddress?: string | null | undefined, type?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, address?: { __typename?: 'Address', buildingLabel?: string | null | undefined, longLabel?: string | null | undefined, country?: string | null | undefined, postalCode?: string | null | undefined, city?: { __typename?: 'KeyedString', label: string } | null | undefined, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } | null | undefined };

export type IndividualByIdQueryVariables = Exact<{
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
}>;


export type IndividualByIdQuery = { __typename?: 'Query', individualByID?: { __typename?: 'Individual', id: string, firstName?: string | null | undefined, lastName?: string | null | undefined, middleName?: string | null | undefined, mailingName?: string | null | undefined, webAddress?: string | null | undefined, specialties?: Array<{ __typename?: 'KeyedString', label: string } | null | undefined> | null | undefined, title?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, professionalType?: { __typename?: 'KeyedString', label: string } | null | undefined, mainActivity?: { __typename?: 'Activity', phone?: string | null | undefined, fax?: string | null | undefined, title?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, workplace?: { __typename?: 'Workplace', name?: string | null | undefined, localPhone?: string | null | undefined, intlFax?: string | null | undefined, webAddress?: string | null | undefined, address?: { __typename?: 'Address', postalCode?: string | null | undefined, longLabel?: string | null | undefined, buildingLabel?: string | null | undefined, country?: string | null | undefined, county?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, city?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined } | null | undefined } | null | undefined } | null | undefined, otherActivities?: Array<{ __typename?: 'Activity', phone?: string | null | undefined, fax?: string | null | undefined, title?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, workplace?: { __typename?: 'Workplace', name?: string | null | undefined, localPhone?: string | null | undefined, intlFax?: string | null | undefined, webAddress?: string | null | undefined, address?: { __typename?: 'Address', postalCode?: string | null | undefined, longLabel?: string | null | undefined, buildingLabel?: string | null | undefined, country?: string | null | undefined, county?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, city?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined } | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type LabelsByCodeQueryVariables = Exact<{
  first: Scalars['Int'];
  offset?: InputMaybe<Scalars['Int']>;
  criteria?: InputMaybe<Scalars['String']>;
  codeTypes: Array<Scalars['String']> | Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
}>;


export type LabelsByCodeQuery = { __typename?: 'Query', labelsByCode?: { __typename?: 'CodesResult', edges?: Array<{ __typename?: 'CodesResultEdge', node: { __typename?: 'Code', id: string, lisCode: string, lisLbl: string, longLbl: string } } | null | undefined> | null | undefined } | null | undefined };

export type MySubscriptionKeyQueryVariables = Exact<{ [key: string]: never; }>;


export type MySubscriptionKeyQuery = { __typename?: 'Query', mySubscriptionKey?: { __typename?: 'SubscriptionKey', countries?: Array<string> | null | undefined } | null | undefined };

export type ReviewsByIndividualQueryVariables = Exact<{
  idnat: Scalars['String'];
}>;


export type ReviewsByIndividualQuery = { __typename?: 'Query', reviews?: { __typename?: 'ReviewsResult', rpps?: string | null | undefined, adeli?: string | null | undefined, idnat?: string | null | undefined, diseases?: Array<{ __typename?: 'Disease', id?: number | null | undefined, name?: string | null | undefined } | null | undefined> | null | undefined, reviews?: Array<{ __typename?: 'Review', text?: string | null | undefined, reviewer?: string | null | undefined, createdAt?: string | null | undefined, diseases?: Array<{ __typename?: 'Disease', id?: number | null | undefined, name?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type SuggestionsQueryVariables = Exact<{
  criteria?: InputMaybe<Scalars['String']>;
  scope?: InputMaybe<SuggestionScope>;
  country?: InputMaybe<Scalars['String']>;
  specialties?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  medTerms?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  location?: InputMaybe<GeopointQuery>;
  locale?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type SuggestionsQuery = { __typename?: 'Query', suggestions?: { __typename?: 'SuggestionsResult', edges?: Array<{ __typename?: 'SuggestionsResultEdge', node: { __typename?: 'Suggestion', individual?: { __typename?: 'IndividualSuggestionFragment', firstName?: string | null | undefined, lastName?: string | null | undefined, middleName?: string | null | undefined, activity?: { __typename?: 'Activity', id: string, workplace?: { __typename?: 'Workplace', address?: { __typename?: 'Address', longLabel?: string | null | undefined, postalCode?: string | null | undefined, county?: { __typename?: 'KeyedString', label: string } | null | undefined, city?: { __typename?: 'KeyedString', label: string } | null | undefined, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } | null | undefined } | null | undefined } | null | undefined, specialties?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined, medTerms?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined } | null | undefined, address?: { __typename?: 'Address', longLabel?: string | null | undefined, country?: string | null | undefined, postalCode?: string | null | undefined, city?: { __typename?: 'KeyedString', label: string } | null | undefined } | null | undefined, workplace?: { __typename?: 'WorkplaceSuggestionFragment', id: string, name?: string | null | undefined, type?: { __typename?: 'KeyedString', label: string } | null | undefined } | null | undefined, specialty?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, medTerm?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined } } | null | undefined> | null | undefined } | null | undefined };

export type IndividualCoreFragment = { __typename?: 'Individual', id: string, firstName?: string | null | undefined, lastName?: string | null | undefined, middleName?: string | null | undefined, reviewsAvailable?: boolean | null | undefined, diseasesAvailable?: boolean | null | undefined, mainActivity?: { __typename?: 'Activity', id: string, urls?: Array<{ __typename?: 'Url', url?: { __typename?: 'UrlDetail', generated?: string | null | undefined, webcrawled?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined, specialties?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined };

export type WorkplaceByIdQueryVariables = Exact<{
  id: Scalars['ID'];
  locale?: InputMaybe<Scalars['String']>;
}>;


export type WorkplaceByIdQuery = { __typename?: 'Query', workplaceByID?: { __typename?: 'Workplace', id: string, name?: string | null | undefined, officialName?: string | null | undefined, intlPhone?: string | null | undefined, intlFax?: string | null | undefined, webAddress?: string | null | undefined, children?: Array<{ __typename?: 'Workplace', id: string, name?: string | null | undefined, officialName?: string | null | undefined, intlPhone?: string | null | undefined, intlFax?: string | null | undefined, webAddress?: string | null | undefined, individuals?: Array<{ __typename?: 'Individual', id: string, firstName?: string | null | undefined, lastName?: string | null | undefined, middleName?: string | null | undefined, reviewsAvailable?: boolean | null | undefined, diseasesAvailable?: boolean | null | undefined, mainActivity?: { __typename?: 'Activity', id: string, urls?: Array<{ __typename?: 'Url', url?: { __typename?: 'UrlDetail', generated?: string | null | undefined, webcrawled?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined, specialties?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined } | null | undefined> | null | undefined, children?: Array<{ __typename?: 'Workplace', id: string, name?: string | null | undefined, officialName?: string | null | undefined, intlPhone?: string | null | undefined, intlFax?: string | null | undefined, webAddress?: string | null | undefined, individuals?: Array<{ __typename?: 'Individual', id: string, firstName?: string | null | undefined, lastName?: string | null | undefined, middleName?: string | null | undefined, reviewsAvailable?: boolean | null | undefined, diseasesAvailable?: boolean | null | undefined, mainActivity?: { __typename?: 'Activity', id: string, urls?: Array<{ __typename?: 'Url', url?: { __typename?: 'UrlDetail', generated?: string | null | undefined, webcrawled?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined, specialties?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined } | null | undefined> | null | undefined, children?: Array<{ __typename?: 'Workplace', id: string, name?: string | null | undefined, officialName?: string | null | undefined, intlPhone?: string | null | undefined, intlFax?: string | null | undefined, webAddress?: string | null | undefined, individuals?: Array<{ __typename?: 'Individual', id: string, firstName?: string | null | undefined, lastName?: string | null | undefined, middleName?: string | null | undefined, reviewsAvailable?: boolean | null | undefined, diseasesAvailable?: boolean | null | undefined, mainActivity?: { __typename?: 'Activity', id: string, urls?: Array<{ __typename?: 'Url', url?: { __typename?: 'UrlDetail', generated?: string | null | undefined, webcrawled?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined, specialties?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined } | null | undefined> | null | undefined, type?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, address?: { __typename?: 'Address', buildingLabel?: string | null | undefined, longLabel?: string | null | undefined, country?: string | null | undefined, postalCode?: string | null | undefined, city?: { __typename?: 'KeyedString', label: string } | null | undefined, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } | null | undefined } | null | undefined> | null | undefined, type?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, address?: { __typename?: 'Address', buildingLabel?: string | null | undefined, longLabel?: string | null | undefined, country?: string | null | undefined, postalCode?: string | null | undefined, city?: { __typename?: 'KeyedString', label: string } | null | undefined, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } | null | undefined } | null | undefined> | null | undefined, type?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, address?: { __typename?: 'Address', buildingLabel?: string | null | undefined, longLabel?: string | null | undefined, country?: string | null | undefined, postalCode?: string | null | undefined, city?: { __typename?: 'KeyedString', label: string } | null | undefined, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } | null | undefined } | null | undefined> | null | undefined, individuals?: Array<{ __typename?: 'Individual', id: string, firstName?: string | null | undefined, lastName?: string | null | undefined, middleName?: string | null | undefined, reviewsAvailable?: boolean | null | undefined, diseasesAvailable?: boolean | null | undefined, mainActivity?: { __typename?: 'Activity', id: string, urls?: Array<{ __typename?: 'Url', url?: { __typename?: 'UrlDetail', generated?: string | null | undefined, webcrawled?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined, specialties?: Array<{ __typename?: 'KeyedString', code: string, label: string } | null | undefined> | null | undefined } | null | undefined> | null | undefined, type?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, address?: { __typename?: 'Address', buildingLabel?: string | null | undefined, longLabel?: string | null | undefined, country?: string | null | undefined, postalCode?: string | null | undefined, city?: { __typename?: 'KeyedString', label: string } | null | undefined, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } | null | undefined } | null | undefined };

export type WorkplacesQueryVariables = Exact<{
  first: Scalars['Int'];
  offset: Scalars['Int'];
  criteria?: InputMaybe<Scalars['String']>;
  criterias?: InputMaybe<Array<InputMaybe<WorkplaceCriteria>> | InputMaybe<WorkplaceCriteria>>;
  criteriaScope?: InputMaybe<WorkplaceCriteriaScope>;
  country?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<GeopointQuery>;
  locale?: InputMaybe<Scalars['String']>;
  sorts?: InputMaybe<Array<InputMaybe<WorkplaceSortScope>> | InputMaybe<WorkplaceSortScope>>;
  sortScope?: InputMaybe<WorkplaceSortScope>;
}>;


export type WorkplacesQuery = { __typename?: 'Query', workplaces?: { __typename?: 'WorkplacesResult', edges?: Array<{ __typename?: 'WorkplacesResultEdge', distance: number, node: { __typename?: 'Workplace', id: string, name?: string | null | undefined, officialName?: string | null | undefined, intlPhone?: string | null | undefined, intlFax?: string | null | undefined, webAddress?: string | null | undefined, type?: { __typename?: 'KeyedString', code: string, label: string } | null | undefined, address?: { __typename?: 'Address', buildingLabel?: string | null | undefined, longLabel?: string | null | undefined, country?: string | null | undefined, postalCode?: string | null | undefined, city?: { __typename?: 'KeyedString', label: string } | null | undefined, location?: { __typename?: 'Geopoint', lat: number, lon: number } | null | undefined } | null | undefined } } | null | undefined> | null | undefined } | null | undefined };
