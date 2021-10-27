const CommonInitService = (function() {
    // 
    const initialValuesImageModal = function (type: string) {
        return {
            isOpen: false,
            title: '',
            actionType: '', // new or edit
            memId: '',
            repId: '',
            frmId: ''
        };
    }


    return {
        // Common Fns
        initialValuesImageModal: initialValuesImageModal
    }

})();

export default CommonInitService;