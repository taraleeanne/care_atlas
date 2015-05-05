;(function($n2){

var lang = 'en';

if( !$n2.l10n ) $n2.l10n = {};
if( !$n2.l10n.strings ) $n2.l10n.strings = {};  
if( !$n2.l10n.strings[lang] ) $n2.l10n.strings[lang] = {};

function loadStrings(strings) {
    var dic = $n2.l10n.strings[lang];
    for(var key in strings) {
        dic[key] = strings[key];
    };
};

loadStrings({
	"care_filterKey_french":"French"
	,"care_filterKey_oeyc":"OEYC"
	,"care_filterKey_resource":"Resource"
	,"care_filterKey_playgroup":"Playgroup"
	,"care_filterKey_male":"Male"
	,"care_filterKey_health":"Health"
	,"care_filterKey_language":"Language"
	,"care_filterKey_parenting":"Parenting"
	,"care_filterKey_pre_natal":"Pre-Natal"
	,"care_filterKey_post_natal":"Post-Natal"
	,"care_filterKey_arts":"Arts"
	,"care_filterKey_massage":"Massage"
	,"care_filterKey_yoga":"Yoga"
	,"care_filterKey_disability":"Disability"
	,"care_filterKey_daycare":"Day Care"
});

})(nunaliit2);
