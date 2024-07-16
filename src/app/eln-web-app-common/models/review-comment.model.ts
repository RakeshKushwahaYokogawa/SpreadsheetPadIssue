export interface IReviewComment {
  text: string;
  createdById: string;
  createdByName: string;
  createdOn: string;

  newText: string;
  isEdit: boolean,
  isDelete: boolean,
  comments?: Array<IReviewComment>;
}
