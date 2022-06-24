import Vue from 'vue'

// FontAwesome
import {
	library,
	dom
} from '@fortawesome/fontawesome-svg-core'

import {
	faArrowsAltH,
	faAngleRight,
	faCog,
	faUser,
	faUsers,
	faPowerOff,
	faTachometerAlt,
	faPen,
	faEye,
	faTrash,
	faTrashAlt,
	faPlus,
	faFilter,
	faTimes,
	faRedoAlt,
	faGlobe,
	faPlusCircle,
	faTimesCircle,
	faSignOutAlt,
	faEllipsisV,
	faFileInvoice,
	faChevronLeft,
	faChevronRight,
	faBook,
	faBars,
	faFolderOpen,
	faCaretSquareRight,
	faPlay,
	faFile,
	faUpload,
	faDownload,
	faFileAlt,
	faPaperclip, faStar, faStamp, faCertificate, faUserPlus, faUserMinus, faArrowLeft, faComments, faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'

import {
	FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

library.add(
	faArrowsAltH,
	faAngleRight,
	faCog,
	faUser,
	faUsers,
	faPowerOff,
	faTachometerAlt,
	faPen,
	faEye,
	faTrash,
	faTrashAlt,
	faPlus,
	faFilter,
	faTimes,
	faRedoAlt,
	faGlobe,
	faPlusCircle,
	faTimesCircle,
	faSignOutAlt,
	faEllipsisV,
	faFileInvoice,
	faChevronLeft,
	faChevronRight,
	faBook,
	faBars,
	faFolderOpen,
	faCaretSquareRight,
	faPlay,
	faFile,
	faUpload,
	faDownload,
	faFileAlt,
	faPaperclip,
	faStar,
	faStamp,
	faCertificate,
	faUserPlus,
	faUserMinus,
	faArrowLeft,
	faComments,
	faPaperPlane

)

dom.watch()

Vue.component('font-awesome-icon', FontAwesomeIcon)
