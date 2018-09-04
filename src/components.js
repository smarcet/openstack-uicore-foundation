import React from 'react';
import T from 'i18n-react';

import { AjaxLoader } from './components/ajaxloader';
import RawHTML from './components/raw-html/index';
import FreeTextSearch from './components/free-text-search/index';
import GMap from './components/google-map/index';
import DateTimePicker from './components/inputs/datetimepicker/index'
import GroupedDropdown from './components/inputs/grouped-dropdown/index'
import UploadInput from './components/inputs/upload-input/index'
import CompanyInput from './components/inputs/company-input'
import OrganizationInput from './components/inputs/organization-input'
import CountryDropdown from './components/inputs/country-dropdown'
import Dropdown from './components/inputs/dropdown'
import TextEditor from './components/inputs/editor-input'
import EventInput from './components/inputs/event-input'
import GroupInput from './components/inputs/group-input'
import MemberInput from './components/inputs/member-input'
import SpeakerInput from './components/inputs/speaker-input'
import TagInput from './components/inputs/tag-input'
import Input from './components/inputs/text-input'
import Panel from './components/sections/panel'
import SimpleLinkList from './components/simple-link-list/index'
import SummitDropdown from './components/summit-dropdown/index'
import Table from './components/table/Table'
import SortableTable from './components/table-sortable/SortableTable'
import SimpleForm from './components/forms/simple-form'
import RadioList from './components/inputs/radio-list'


let language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;

// language would be something like es-ES or es_ES
// However we store our files with format es.json or en.json
// therefore retrieve only the first 2 digits

if (language.length > 2) {
    language = language.split("-")[0];
    language = language.split("_")[0];
}

T.setTexts(require(`./i18n/${language}.json`));


export {
    AjaxLoader,
    RawHTML,
    FreeTextSearch,
    GMap,
    DateTimePicker,
    GroupedDropdown,
    UploadInput,
    CompanyInput,
    OrganizationInput,
    CountryDropdown,
    Dropdown,
    EventInput,
    GroupInput,
    MemberInput,
    SpeakerInput,
    TagInput,
    TextEditor,
    Input,
    Panel,
    SimpleLinkList,
    SummitDropdown,
    Table,
    SortableTable,
    SimpleForm,
    RadioList
};
