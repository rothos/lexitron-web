export interface EtymologyResponse {
  data: {
    items: Array<{
      vocabularies: Array<{
        doc_id: string;
        domain_id: number;
        word: string;
        toxicity: number;
        type: number;
        thumbnail: boolean;
        property?: string;
        etymology?: string;
        first_recorded?: string;
        content_length?: number;
        modify_time?: number;
      }>;
      relative_words?: {
        relation_details: Array<{
          id: string;
          domain_id: number;
          word: string;
          canonical_word: string;
          type: number;
          property?: string;
          etymology?: string;
          thumbnail: boolean;
          locale_code: string;
          support_lang: string[];
          down_weight: boolean;
        }>;
        relative_words: string[];
        total: number;
        more: boolean;
      };
      alphabets?: string[];
      alphabets_v2?: Array<{
        word: string;
        canonical: string;
      }>;
      others_are_reading?: Array<{
        key: string;
        word: string;
        desc: string;
      }>;
    }>;
  };
} 