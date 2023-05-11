import { Row, RowId } from '../../common/model/model';

export interface Chat {
  content: string;
  topic_id: RowId;
  created_at: Date;
  updated_at: Date;
}

export interface StoredChat extends Row<Chat> {}
