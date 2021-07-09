import { Locale } from "../../../config";
import { dataSourceLinkedLogger as logger } from "../../logger";
import DataSource from "./DataSource";

type LinkedResponse<E> = {
  meta: unknown;
  data: E[];
};

type LinkedObjectRef = {
  "@id": string;
};

type LinkedExternalLink = {
  name: string;
  link: string;
  language: string;
};

type LinkedTranslation = {
  fi?: string | null;
  sv?: string | null;
  en?: string | null;
} | null;

type LinkedOffer<Translation = LinkedTranslation> = {
  is_free: boolean;
  description: Translation;
  info_url: Translation;
  price: number;
};

type LinkedImage<Translation = LinkedTranslation> = {
  id: number;
  license: string;
  created_time: string;
  last_modified_time: string;
  name: Translation;
  url: string;
  cropping: string;
  photographer_name: string;
  alt_text: Translation;
  data_source: string;
  publisher: string;
  "@id": string;
  "@context": string;
  "@type": string;
};

type LinkedEvent<Translation = LinkedTranslation> = {
  id: string;
  location: LinkedObjectRef;
  keywords: LinkedObjectRef[];
  super_event: unknown | null;
  event_status: string;
  type_id: string;
  external_links: LinkedExternalLink[];
  offers: LinkedOffer<Translation>[];
  data_source: string;
  publisher: string;
  sub_events: string[];
  images: LinkedImage<Translation>[];
  videos: unknown[];
  in_language: LinkedObjectRef[];
  audience: unknown[];
  created_time: string;
  last_modified_time: string;
  date_published: null;
  start_time: string;
  end_time: string;
  custom_data: unknown | null;
  audience_min_age: unknown | null;
  audience_max_age: unknown | null;
  super_event_type: unknown | null;
  deleted: boolean;
  maximum_attendee_capacity: number | null;
  remaining_attendee_capacity: number | null;
  minimum_attendee_capacity: number | null;
  enrolment_start_time: string | null;
  enrolment_end_time: string | null;
  local: boolean;
  search_vector_fi: string;
  search_vector_en: string;
  search_vector_sv: string;
  replaced_by: string | null;
  description: Translation;
  info_url: Translation;
  short_description: Translation;
  name: Translation;
  location_extra_info: Translation;
  provider_contact_info: unknown | null;
  provider: Translation;
  "@id": string;
  "@context": string;
  "@type": string;
};

// https://api.hel.fi/linkedevents/v1
class Linked extends DataSource {
  async getUpcomingEvents(
    id: string,
    language?: Locale
  ): Promise<LinkedEvent[] | LinkedEvent<string>[]> {
    const params = new URLSearchParams();
    params.set("start", "now");
    params.set("location", id);

    if (language) {
      params.set("language", language);
      params.set("translation", language);
    }

    const response = await this.get<LinkedResponse<LinkedEvent>>(
      `https://api.hel.fi/linkedevents/v1/event/?${params}`
    );
    // Get the first 6 only as the UI doesn't show more ever. Linked API does
    // not offer a way to limit the result set.
    return response?.data?.data.slice(0, 6) ?? [];
  }
}

export default new Linked(logger);
