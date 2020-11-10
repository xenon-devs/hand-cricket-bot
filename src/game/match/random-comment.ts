export enum COMMENT_CATEGORIES {
  OUT = 'out',
  SIX = 'six',
  BOUNDARY = 'boundary',
  FORFEIT = 'forfeit'
}

const OUT_COMMENTS = [
  (): string => `Clean bowled!`,
  (): string => `Run out.`,
  (): string => `Caught and bowled!`,
  (): string => `LBW -_-`
]

const SIX_COMMENTS = [
  (): string => `Six distance: ${Math.random() * 100}m`,
  (): string => `OUT OF THE STADIUM!!!`,
  (): string => `Now you can sign balls instead also instead of just documents.`
]

const BOUNDARY_COMMENTS = [
  (): string => `Missed the sixer by a few milimeters.`,
  (): string => `Four!`
]

const FORFEIT_COMMENTS = [
  (forfeiterId: string):string => `<@${forfeiterId}> walked out.`,
  (forfeiterId: string):string => `<@${forfeiterId}> had better things to do.`,
  (forfeiterId: string):string => `<@${forfeiterId}> would rather play hide and seek`,
  (forfeiterId: string):string => `<@${forfeiterId}> ran away in fear.`,
  (forfeiterId: string):string => `<@${forfeiterId}> doesn't consider the opponent worthy.`
]

export interface IRandomCommentExtraOptions {
  /** Only for FORFEIT comments */
  forfeiterId?: string
}

export const getRandomComment = (
  commentCategory: COMMENT_CATEGRORIES,
  extraOptions?: IRandomCommentExtraOptions
) => {
  switch(commentCategory) {
    case COMMENT_CATEGRORIES.BOUNDARY:
      return OUT_COMMENTS[
        Math.min(
          OUT_COMMENTS.length - 1,
          Math.floor(Math.random() * (OUT_COMMENTS.length + 1))
        )
      ]()

    case COMMENT_CATEGRORIES.SIX:
      return SIX_COMMENTS[
        Math.min(
          SIX_COMMENTS.length - 1,
          Math.floor(Math.random() * (SIX_COMMENTS.length + 1))
        )
      ]()

    case COMMENT_CATEGRORIES.BOUNDARY:
      return BOUNDARY_COMMENTS[
        Math.min(
          BOUNDARY_COMMENTS.length - 1,
          Math.floor(Math.random() * (BOUNDARY_COMMENTS.length + 1))
        )
      ]()

    case COMMENT_CATEGRORIES.FORFEIT:
      return FORFEIT_COMMENTS[
        Math.min(
          FORFEIT_COMMENTS.length - 1,
          Math.floor(Math.random() * (FORFEIT_COMMENTS.length + 1))
        )
      ](<string>extraOptions.forfeiterId)
  }
}
