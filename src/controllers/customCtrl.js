
import { replaceHtml } from '../utils/util';
import formula from '../global/formula';
import { modelHTML } from './constant';
import { selectionCopyShow } from './select';
import sheetmanage from './sheetmanage';
import { getRangetxt } from '../methods/get';
import locale from '../locale/locale';
import Store from '../store';

const customCtrl = {
    selectRange: [],
    selectStatus: false,
    init: function(confirmCallback){
        $(document).off("click.selectionRangeConfirm").on("click.selectionRangeConfirm", "#luckysheet-selectionRange-dialog-confirm", function(e) {
            let txt = $(this).parents("#luckysheet-selectionRange-dialog").find("input").val();
    
            $("#luckysheet-selectionRange-dialog #data-verification-range input").val(txt);
            
            $("#luckysheet-selectionRange-dialog").hide();
    
            if(formula.rangetosheet != null && formula.rangetosheet != Store.currentSheetIndex){
                sheetmanage.changeSheetExec(formula.rangetosheet);
                formula.rangetosheet = null;
            }
    
            let range = [];
            selectionCopyShow(range);

            if (typeof confirmCallback === 'function') {
                confirmCallback(txt)
            }
        });
        $(document).off("click.selectionRangeClose").on("click.selectionRangeClose", "#luckysheet-selectionRange-dialog-close", function(e) {
            $("#luckysheet-selectionRange-dialog").hide();
    
            if(formula.rangetosheet != null && formula.rangetosheet != Store.currentSheetIndex){
                sheetmanage.changeSheetExec(formula.rangetosheet);
                formula.rangetosheet = null;
            }
    
            let range = [];
            selectionCopyShow(range);
        });
    },
    rangeDialog: function(txt){
        let _this = this;

        const _locale = locale();
        const dvText = _locale.dataVerification;
        const buttonText = _locale.button;

        $("#luckysheet-modal-dialog-mask").hide();
        $("#luckysheet-selectionRange-dialog").remove();

        $("body").append(replaceHtml(modelHTML, { 
            "id": "luckysheet-selectionRange-dialog", 
            "addclass": "luckysheet-selectionRange-dialog", 
            "title": dvText.selectCellRange, 
            "content": `<input style="height: 30px;padding: 0 10px;border: 1px solid #d4d4d4;outline-style: none;" readonly="readonly" placeholder="${dvText.selectCellRange2}" value="${txt}"/>`, 
            "botton":  `<button id="luckysheet-selectionRange-dialog-confirm" class="btn btn-primary">${buttonText.confirm}</button>
                        <button id="luckysheet-selectionRange-dialog-close" class="btn btn-default">${buttonText.close}</button>`, 
            "style": "z-index:100003" 
        }));
        let $t = $("#luckysheet-selectionRange-dialog")
                .find(".luckysheet-modal-dialog-content")
                .css("min-width", 300)
                .end(), 
            myh = $t.outerHeight(), 
            myw = $t.outerWidth();
        let winw = $(window).width(), winh = $(window).height();
        let scrollLeft = $(document).scrollLeft(), scrollTop = $(document).scrollTop();
        $("#luckysheet-selectionRange-dialog").css({ 
            "left": (winw + scrollLeft - myw) / 2, 
            "top": (winh + scrollTop - myh) / 3 
        }).show();
    },
    getTxtByRange: function(range){
        if(range.length > 0){
            let txt = [];

            for(let s = 0; s < range.length; s++){
                let r1 = range[s].row[0], r2 = range[s].row[1];
                let c1 = range[s].column[0], c2 = range[s].column[1];
                
                txt.push(getRangetxt(Store.currentSheetIndex, { "row": [r1, r2], "column": [c1, c2] }, Store.currentSheetIndex));
            }

            return txt.join(",");
        }
    },
    getRangeByTxt: function(txt){
        let range = [];

        if(txt.indexOf(",") != -1){
            let arr = txt.split(",");
            for(let i = 0; i < arr.length; i++){
                if(formula.iscelldata(arr[i])){
                    range.push(formula.getcellrange(arr[i]));
                }
                else{
                    range = [];
                    break;    
                }
            }
        }
        else{
            if(formula.iscelldata(txt)){
                range.push(formula.getcellrange(txt));
            }
        }

        return range;
    },
}

export default customCtrl;