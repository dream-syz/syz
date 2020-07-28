let Tools = new ToolsFactory();

function CompAlert() {
    const _default = {
        title: '',
        type: 'info',   // success | warning | info | error
        description: '',
        closable: true,
        center: true,
        closeText: '',
        showIcon: false,
        effect: 'light' //  light | dark
    };
    this.init = (options) => {
        let opt = Tools.extend(_default, options.data);
        let wrapper = document.getElementById(options.name);
        let tWrap = document.createElement('div');
        tWrap.setAttribute('role','alert');
        tWrap.setAttribute('class','HD_alert alert alert-warning alert-dismissible');
        tWrap.setAttribute('id', `hd_${alertNum}`);
        tWrap.innerHTML =
            `<button type="button" class="hd-alert__closeBtn hd-icon-close close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
             <div class="hd-alert__content">
                 <i class="glyphicon glyphicon-info-sign"></i>
                 <span class="hd-alert__title is-bold">${opt.title}</span>
                 <iframe class="hide" frameborder="0"  src="/media/dididi.mp3"></iframe>
                 <p class="hd-alert__description">${opt.description}</p>
             </div>`;
        wrapper.appendChild(tWrap);
    };
}

function ToolsFactory(){
    this.extend = (sub, sup) => {
        let temp = {};
        for (let variable in sub) {
            if (sub.hasOwnProperty(variable)) {
                temp[variable] = sup[variable] ? sup[variable] : sub[variable]
            }
        }
        return temp;
    }
}