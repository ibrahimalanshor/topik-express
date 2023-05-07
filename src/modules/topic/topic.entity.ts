import { Row } from '../../common/model/model';

export interface Topic {
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface StoredTopic extends Row<Topic> {}

export interface CreationTopic {
  name: string;
}
