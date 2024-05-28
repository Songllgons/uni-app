import fs from '@ohos.file.fs';
import picker from '@ohos.file.picker';
import image from '@ohos.multimedia.image';
import media from '@ohos.multimedia.media';
import http from '@ohos.net.http';
import fs1 from '@ohos.file.fs';
import http1 from '@ohos.net.http';
import http2 from '@ohos.net.http';
import picker1 from '@ohos.file.picker';
import picker2 from '@ohos.file.picker';
interface MediaFile {
    fileType: 'video' | 'image';
    tempFilePath: string;
    size: number;
    width?: number;
    height?: number;
    duration?: number;
    thumbTempFilePath?: string;
}
interface chooseMediaOptions {
    mimeType: picker.PhotoViewMIMETypes.VIDEO_TYPE | picker.PhotoViewMIMETypes.IMAGE_TYPE;
    count?: number;
}
interface chooseMediaSuccessCallbackResult {
    tempFiles: MediaFile[];
}
interface VideoInfo {
    size: number;
    orientation?: 'up' | 'down' | 'left' | 'right' | 'up-mirrored' | 'down-mirrored' | 'left-mirrored' | 'right-mirrored';
    type?: string;
    duration?: number;
    height?: number;
    width?: number;
}
async function _getVideoInfo(uri: string): Promise<VideoInfo> {
    const file = await fs.open(uri, fs.OpenMode.READ_ONLY);
    const avMetadataExtractor = await media.createAVMetadataExtractor();
    let metadata: media.AVMetadata | null = null;
    let size: number = 0;
    try {
        size = (await fs.stat(file.fd)).size;
        avMetadataExtractor.dataSrc = {
            fileSize: size,
            callback: (buffer: ArrayBuffer, length: number, pos: number | null = null)=>{
                return fs.readSync(file.fd, buffer, {
                    offset: pos,
                    length
                } as UTSJSONObject);
            }
        };
        metadata = await avMetadataExtractor.fetchMetadata();
    } catch (error) {
        throw error;
    } finally{
        await avMetadataExtractor.release();
        await fs.close(file);
    }
    const videoOrientationArr = [
        'up',
        'right',
        'down',
        'left'
    ] as VideoInfo['orientation'][];
    return {
        size: size,
        duration: metadata.duration ? Number(metadata.duration) / 1000 : undefined,
        width: metadata.videoWidth ? Number(metadata.videoWidth) : undefined,
        height: metadata.videoHeight ? Number(metadata.videoHeight) : undefined,
        type: metadata.mimeType,
        orientation: metadata.videoOrientation ? videoOrientationArr[Number(metadata.videoOrientation) / 90] : undefined
    };
}
interface ImageInfo {
    path: string;
    orientation: 'up' | 'down' | 'left' | 'right' | 'up-mirrored' | 'down-mirrored' | 'left-mirrored' | 'right-mirrored';
    height: number;
    width: number;
}
async function _getImageInfo(uri: string): Promise<ImageInfo> {
    const file = await fs.open(uri, fs.OpenMode.READ_ONLY);
    const imageSource = image.createImageSource(file.fd);
    const imageInfo = await imageSource.getImageInfo();
    const orientation = await imageSource.getImageProperty(image.PropertyKey.ORIENTATION);
    let orientationNum = 0;
    if (typeof orientation === 'string') {
        const matched = orientation.match(/^Unknown value (\d)$/);
        if (matched && matched[1]) {
            orientationNum = Number(matched[1]);
        } else if (/^\d$/.test(orientation)) {
            orientationNum = Number(orientation);
        }
    } else if (typeof orientation === 'number') {
        orientationNum = orientation;
    }
    let orientationStr: ImageInfo['orientation'] = 'up';
    switch(orientationNum){
        case 2:
            orientationStr = 'up-mirrored';
            break;
        case 3:
            orientationStr = 'down';
            break;
        case 4:
            orientationStr = 'down-mirrored';
            break;
        case 5:
            orientationStr = 'left-mirrored';
            break;
        case 6:
            orientationStr = 'right';
            break;
        case 7:
            orientationStr = 'right-mirrored';
            break;
        case 8:
            orientationStr = 'left';
            break;
        case 0:
        case 1:
        default:
            orientationStr = 'up';
            break;
    }
    return {
        path: uri,
        width: imageInfo.size.width,
        height: imageInfo.size.height,
        orientation: orientationStr
    };
}
async function _chooseMedia(options: chooseMediaOptions): Promise<chooseMediaSuccessCallbackResult> {
    const photoSelectOptions = new picker.PhotoSelectOptions();
    const mimeType = options.mimeType;
    photoSelectOptions.MIMEType = mimeType;
    photoSelectOptions.maxSelectNumber = options.count || 9;
    const photoPicker = new picker.PhotoViewPicker();
    const photoSelectResult = await photoPicker.select(photoSelectOptions);
    const uris = photoSelectResult.photoUris;
    if (mimeType !== picker.PhotoViewMIMETypes.VIDEO_TYPE) {
        return {
            tempFiles: uris.map((uri)=>{
                const file = fs.openSync(uri, fs.OpenMode.READ_ONLY);
                const stat = fs.statSync(file.fd);
                fs.closeSync(file);
                return {
                    fileType: 'image',
                    tempFilePath: uri,
                    size: stat.size
                };
            })
        };
    }
    const tempFiles: MediaFile[] = [];
    for(let i = 0; i < uris.length; i++){
        const uri = uris[i];
        const videoInfo = await _getVideoInfo(uri);
        tempFiles.push({
            fileType: 'video',
            tempFilePath: uri,
            size: videoInfo.size,
            duration: videoInfo.duration,
            width: videoInfo.width,
            height: videoInfo.height
        } as UTSJSONObject);
    }
    return {
        tempFiles
    };
}
const extend = Object.assign;
const isArray = Array.isArray;
const I18N_JSON_DELIMITERS: [string, string] = [
    '%',
    '%'
];
const WEB_INVOKE_APPSERVICE = 'WEB_INVOKE_APPSERVICE';
const ON_SHOW = 'onShow';
const ON_HIDE = 'onHide';
const ON_LAUNCH = 'onLaunch';
const ON_ERROR = 'onError';
const ON_PAGE_NOT_FOUND = 'onPageNotFound';
const ON_UNHANDLE_REJECTION = 'onUnhandledRejection';
const ON_RESIZE = 'onResize';
const ON_BACK_PRESS = 'onBackPress';
const ON_PAGE_SCROLL = 'onPageScroll';
const ON_REACH_BOTTOM = 'onReachBottom';
const ON_NAVIGATION_BAR_BUTTON_TAP = 'onNavigationBarButtonTap';
const ON_APP_ENTER_FOREGROUND = 'onAppEnterForeground';
const ON_APP_ENTER_BACKGROUND = 'onAppEnterBackground';
function hasLeadingSlash(str: string) {
    return str.indexOf('/') === 0;
}
function addLeadingSlash(str: string) {
    return hasLeadingSlash(str) ? str : '/' + str;
}
const invokeArrayFns = (fns: Function[], arg: Object | null = null)=>{
    let ret;
    for(let i = 0; i < fns.length; i++){
        ret = fns[i](arg);
    }
    return ret;
};
function once<T extends (...args: Object[]) => Object>(fn: T, ctx: Object = null): T {
    let res: Object;
    return (...args: Object[])=>{
        if (fn) {
            res = fn.apply(ctx, args);
            fn = null as Object;
        }
        return res;
    } as T;
}
const encode = encodeURIComponent;
function stringifyQuery(obj: Record<string, Object> | null = null, encodeStr = encode) {
    const res = obj ? Object.keys(obj).map((key)=>{
        let val = obj[key];
        if (typeof val === undefined || val === null) {
            val = '';
        } else if (isPlainObject(val)) {
            val = JSON.stringify(val);
        }
        return encodeStr(key) + '=' + encodeStr(val);
    }).filter((x)=>x.length > 0).join('&') : null;
    return res ? `?${res}` : '';
}
function decode(text: string | number): string {
    try {
        return decodeURIComponent('' + text);
    } catch (err) {}
    return '' + text;
}
const PLUS_RE = /\+/g;
function parseQuery(search: string) {
    const query: Record<string, Object> = {};
    if (search === '' || search === '?') return query;
    const hasLeadingIM = search[0] === '?';
    const searchParams = (hasLeadingIM ? search.slice(1) : search).split('&');
    for(let i = 0; i < searchParams.length; ++i){
        const searchParam = searchParams[i].replace(PLUS_RE, ' ');
        let eqPos = searchParam.indexOf('=');
        let key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
        let value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
        if (key in query) {
            let currentValue = query[key];
            if (!isArray(currentValue)) {
                currentValue = query[key] = [
                    currentValue
                ];
            }
            currentValue.push(value);
        } else {
            query[key] = value;
        }
    }
    return query;
}
function parseUrl(url: string) {
    const _url_split = url.split('?', 2), path = _url_split[0], querystring = _url_split[1];
    return {
        path,
        query: parseQuery(querystring || '')
    };
}
class DOMException extends Error {
    constructor(message: string | null = null){
        super(message);
        this.name = 'DOMException';
    }
}
type UniCSSStyleDeclarationJSON = string | null | Record<string, string | string[]> | [string, Record<string, string | string[]>];
function normalizeEventType(type: string, options: AddEventListenerOptions | null = null) {
    if (options) {
        if (options.capture) {
            type += 'Capture';
        }
        if (options.once) {
            type += 'Once';
        }
        if (options.passive) {
            type += 'Passive';
        }
    }
    return `on${capitalize(camelize(type))}`;
}
type UniNodeType = typeof NODE_TYPE_PAGE | typeof NODE_TYPE_ELEMENT | typeof NODE_TYPE_TEXT | typeof NODE_TYPE_COMMENT;
function sibling(node: UniNode, type: 'n' | 'p') {
    const parentNode = node.parentNode;
    if (!parentNode) {
        return null;
    }
    const childNodes = parentNode.childNodes;
    return childNodes[childNodes.indexOf(node) + (type === 'n' ? 1 : -1)] || null;
}
function removeNode(node: UniNode) {
    const parentNode = node.parentNode;
    if (parentNode) {
        const childNodes = parentNode.childNodes;
        const index = childNodes.indexOf(node);
        if (index > -1) {
            node.parentNode = null;
            childNodes.splice(index, 1);
        }
    }
}
function checkNodeId(node: UniNode) {
    if (!node.nodeId && node.pageNode) {
        node.nodeId = node.pageNode!.genId();
    }
}
interface IUniPageNode {
    pageId: number;
    pageNode: IUniPageNode | null;
    isUnmounted: boolean;
    genId: () => number;
    push: (...args: Object[]) => void;
    onCreate: (thisNode: UniNode, nodeName: string | number) => UniNode;
    onInsertBefore: (thisNode: UniNode, newChild: UniNode, refChild: UniNode | null) => UniNode;
    onRemoveChild: (oldChild: UniNode) => UniNode;
    onAddEvent: (thisNode: UniNode, name: string, flag: number) => void;
    onAddWxsEvent: (thisNode: UniNode, name: string, wxsEvent: string, flag: number) => void;
    onRemoveEvent: (thisNode: UniNode, name: string) => void;
    onSetAttribute: (thisNode: UniNode, qualifiedName: string, value: Object) => void;
    onRemoveAttribute: (thisNode: UniNode, qualifiedName: string) => void;
    onTextContent: (thisNode: UniNode, text: string) => void;
    onNodeValue: (thisNode: UniNode, val: string | null) => void;
}
interface UniEventListener {
    (evt: UniEvent) : void;
    modifiers?: string[];
    wxsEvent?: string;
}
interface UniEventOptions {
    bubbles: boolean;
    cancelable: boolean;
}
class UniEvent {
    type: string;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean = false;
    detail?: Record<string, Object>;
    timeStamp = Date.now();
    _stop: boolean = false;
    _end: boolean = false;
    constructor(type: string, opts: UniEventOptions){
        this.type = type;
        this.bubbles = !!opts.bubbles;
        this.cancelable = !!opts.cancelable;
    }
    preventDefault(): void {
        this.defaultPrevented = true;
    }
    stopImmediatePropagation(): void {
        this._end = this._stop = true;
    }
    stopPropagation(): void {
        this._stop = true;
    }
}
function createUniEvent(evt: Record<string, Object>) {
    if (evt instanceof UniEvent) {
        return evt;
    }
    const _parseEventName = parseEventName(evt.type), type = _parseEventName[0];
    const uniEvent = new UniEvent(type, {
        bubbles: false,
        cancelable: false
    } as UTSJSONObject);
    extend(uniEvent, evt);
    return uniEvent;
}
class UniEventTarget {
    listeners: Record<string, UniEventListener[]> = Object.create(null);
    dispatchEvent(evt: UniEvent): boolean {
        const listeners = this.listeners[evt.type];
        if (!listeners) {
            return false;
        }
        const event = createUniEvent(evt);
        const len = listeners.length;
        for(let i = 0; i < len; i++){
            listeners[i].call(this, event);
            if (event._end) {
                break;
            }
        }
        return event.cancelable && event.defaultPrevented;
    }
    addEventListener(type: string, listener: UniEventListener, options: AddEventListenerOptions | null = null): void {
        type = normalizeEventType(type, options);
        (this.listeners[type] || (this.listeners[type] = [])).push(listener);
    }
    removeEventListener(type: string, callback: UniEventListener, options: AddEventListenerOptions | null = null): void {
        type = normalizeEventType(type, options);
        const listeners = this.listeners[type];
        if (!listeners) {
            return;
        }
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }
}
class UniNode extends UniEventTarget {
    nodeId?: number;
    nodeType: UniNodeType;
    nodeName: string;
    childNodes: UniNode[];
    pageNode: IUniPageNode | null = null;
    parentNode: UniNode | null = null;
    __vueParentComponent?: ComponentInternalInstance;
    protected _text: string | null = null;
    constructor(nodeType: UniNodeType, nodeName: string, container: UniElement | IUniPageNode){
        super();
        if (container) {
            const pageNode = container.pageNode;
            if (pageNode) {
                this.pageNode = pageNode;
                this.nodeId = pageNode!.genId();
                !pageNode!.isUnmounted && pageNode!.onCreate(this, nodeName);
            }
        }
        this.nodeType = nodeType;
        this.nodeName = nodeName;
        this.childNodes = [];
    }
    get firstChild(): UniNode | null {
        return this.childNodes[0] || null;
    }
    get lastChild(): UniNode | null {
        const childNodes = this.childNodes;
        const length = childNodes.length;
        return length ? childNodes[length - 1] : null;
    }
    get nextSibling(): UniNode | null {
        return sibling(this, 'n');
    }
    get nodeValue() {
        return null;
    }
    set nodeValue(_val: string | null) {}
    get textContent() {
        return this._text || '';
    }
    set textContent(text: string) {
        this._text = text;
        if (this.pageNode && !this.pageNode.isUnmounted) {
            this.pageNode.onTextContent(this, text);
        }
    }
    get parentElement(): UniElement | null {
        const parentNode = this.parentNode;
        if (parentNode && parentNode.nodeType === 1) {
            return parentNode as Object as UniElement;
        }
        return null;
    }
    get previousSibling(): UniNode | null {
        return sibling(this, 'p');
    }
    appendChild(newChild: UniNode): UniNode {
        return this.insertBefore(newChild, null);
    }
    cloneNode(deep: boolean | null = null): UniNode {
        const cloned = extend(Object.create(Object.getPrototypeOf(this)), this) as UniNode;
        const attributes = cloned as Object as UniElement.attributes;
        if (attributes) {
            (cloned as Object as UniElement).attributes = extend({} as UTSJSONObject, attributes);
        }
        if (deep) {
            cloned.childNodes = cloned.childNodes.map((childNode)=>childNode.cloneNode(true));
        }
        return cloned;
    }
    insertBefore(newChild: UniNode, refChild: UniNode | null): UniNode {
        removeNode(newChild);
        newChild.pageNode = this.pageNode;
        newChild.parentNode = this;
        checkNodeId(newChild);
        const childNodes = this.childNodes;
        if (refChild) {
            const index = childNodes.indexOf(refChild);
            if (index === -1) {
                throw new DOMException(`Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.`);
            }
            childNodes.splice(index, 0, newChild);
        } else {
            childNodes.push(newChild);
        }
        return this.pageNode && !this.pageNode.isUnmounted ? this.pageNode.onInsertBefore(this, newChild, refChild) : newChild;
    }
    removeChild(oldChild: UniNode): UniNode {
        const childNodes = this.childNodes;
        const index = childNodes.indexOf(oldChild);
        if (index === -1) {
            throw new DOMException(`Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.`);
        }
        oldChild.parentNode = null;
        childNodes.splice(index, 1);
        return this.pageNode && !this.pageNode.isUnmounted ? this.pageNode.onRemoveChild(oldChild) : oldChild;
    }
}
type DictArray = [number, number][];
interface UniNodeJSONMinify {
    i: number;
    n: string | number;
    a: DictArray;
    e: DictArray;
    w: [number, [number, number]][];
    s?: DictArray;
    t?: number;
}
interface UniNodeJSON {
    i: number;
    n: string | number;
    a: Record<string, Object>;
    e: Record<string, number>;
    w: Record<string, [string, number]>;
    s?: UniCSSStyleDeclarationJSON;
    t?: string;
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseEventName(name: string): [string, EventListenerOptions | undefined] {
    let options: EventListenerOptions | undefined;
    if (optionsModifierRE.test(name)) {
        options = {};
        let m;
        while(m = name.match(optionsModifierRE)){
            name = name.slice(0, name.length - m[0].length);
            (options as Object)[m[0].toLowerCase()] = true;
            options;
        }
    }
    return [
        hyphenate(name.slice(2)),
        options
    ];
}
const ACTION_TYPE_PAGE_CREATE = 1;
const ACTION_TYPE_PAGE_CREATED = 2;
const ACTION_TYPE_PAGE_SCROLL = 15;
interface PageNodeOptions {
    css: boolean;
    route: string;
    version: number;
    locale: string;
    platform: string;
    pixelRatio: number;
    windowWidth: number;
    disableScroll: boolean;
    onPageScroll: boolean;
    onPageReachBottom: boolean;
    onReachBottomDistance: number;
    statusbarHeight: number;
    windowTop: number;
    windowBottom: number;
}
interface PageCreateData extends PageNodeOptions {
}
type PageCreateAction = [typeof ACTION_TYPE_PAGE_CREATE, PageCreateData];
type PageCreatedAction = [typeof ACTION_TYPE_PAGE_CREATED];
type CreateAction = [typeof ACTION_TYPE_CREATE, number, string | number, number, number, Partial<UniNodeJSON | UniNodeJSONMinify>?];
type InsertAction = [typeof ACTION_TYPE_INSERT, number, number, number, Partial<UniNodeJSON | UniNodeJSONMinify>?];
type RemoveAction = [typeof ACTION_TYPE_REMOVE, number];
type AddEventAction = [typeof ACTION_TYPE_ADD_EVENT, number, string | number, number];
type AddWxsEventAction = [typeof ACTION_TYPE_ADD_WXS_EVENT, number, string | number, string | number, number];
type RemoveEventAction = [typeof ACTION_TYPE_REMOVE_EVENT, number, string | number];
type SetAttributeAction = [typeof ACTION_TYPE_SET_ATTRIBUTE, number, string | number, Object | number];
type RemoveAttributeAction = [typeof ACTION_TYPE_REMOVE_ATTRIBUTE, number, string | number];
type SetTextAction = [typeof ACTION_TYPE_SET_TEXT, number, string | number];
type PageScrollAction = [typeof ACTION_TYPE_PAGE_SCROLL, number];
type PageUpdateAction = CreateAction | InsertAction | RemoveAction | AddEventAction | AddWxsEventAction | RemoveEventAction | SetAttributeAction | RemoveAttributeAction | SetTextAction;
type PageAction = PageCreateAction | PageCreatedAction | PageUpdateAction | PageScrollAction;
type NavigateToOptionEvents = Record<string, (...args: Object[]) => void>;
interface EventChannelListener {
    type: 'on' | 'once';
    fn: (...args: Object[]) => void;
}
class EventChannel {
    id?: number;
    private listener: Record<string, EventChannelListener[]>;
    private emitCache: {
        args: Object[];
        eventName: string;
    }[];
    constructor(id: number | null = null, events: NavigateToOptionEvents | null = null){
        this.id = id;
        this.listener = {};
        this.emitCache = [];
        if (events) {
            Object.keys(events).forEach((name)=>{
                this.on(name, events[name]);
            });
        }
    }
    emit(eventName: string, ...args: Object[]) {
        const fns = this.listener[eventName];
        if (!fns) {
            return this.emitCache.push({
                eventName,
                args
            } as UTSJSONObject);
        }
        fns.forEach((opt)=>{
            opt.fn.apply(opt.fn, args);
        });
        this.listener[eventName] = fns.filter((opt)=>opt.type !== 'once');
    }
    on(eventName: string, fn: EventChannelListener['fn']) {
        this._addListener(eventName, 'on', fn);
        this._clearCache(eventName);
    }
    once(eventName: string, fn: EventChannelListener['fn']) {
        this._addListener(eventName, 'once', fn);
        this._clearCache(eventName);
    }
    off(eventName: string, fn: EventChannelListener['fn']) {
        const fns = this.listener[eventName];
        if (!fns) {
            return;
        }
        if (fn) {
            for(let i = 0; i < fns.length;){
                if (fns[i].fn === fn) {
                    fns.splice(i, 1);
                    i--;
                }
                i++;
            }
        } else {
            delete this.listener[eventName];
        }
    }
    _clearCache(eventName: string | null = null) {
        for(let index = 0; index < this.emitCache.length; index++){
            const cache = this.emitCache[index];
            const _name = eventName ? cache.eventName === eventName ? eventName : null : cache.eventName;
            if (!_name) continue;
            const location = this.emit.apply(this, [
                _name
            ].concat(cache.args));
            if (typeof location === 'number') {
                this.emitCache.pop();
                continue;
            }
            this.emitCache.splice(index, 1);
            index--;
        }
    }
    _addListener(eventName: string, type: EventChannelListener['type'], fn: EventChannelListener['fn']) {
        (this.listener[eventName] || (this.listener[eventName] = [])).push({
            fn,
            type
        } as UTSJSONObject);
    }
}
interface E {
    e: Record<string, Object>;
    on: (name: EventName, callback: EventCallback, ctx?: Object) => this;
    once: (name: EventName, callback: EventCallback, ctx?: Object) => this;
    emit: (name: EventName, ...args: Object[]) => this;
    off: (name: EventName, callback?: EventCallback) => this;
}
const E = ()=>{} as Object as {
    new(): E;
};
type EventName = string;
type EventCallback = Function;
E.prototype = {
    on: (name: EventName, callback: EventCallback, ctx: Object | null = null)=>{
        let e = this.e || (this.e = {});
        (e[name] || (e[name] = [])).push({
            fn: callback,
            ctx: ctx
        } as UTSJSONObject);
        return this;
    },
    once: (name: EventName, callback: EventCallback, ctx: Object | null = null)=>{
        let self = this;
        const listener = ()=>{
            self.off(name, listener);
            callback.apply(ctx, arguments);
        };
        listener._ = callback;
        return this.on(name, listener, ctx);
    },
    emit: (name: EventName)=>{
        let data = [].slice.call(arguments, 1);
        let evtArr = ((this.e || (this.e = {}))[name] || []).slice();
        let i = 0;
        let len = evtArr.length;
        for(i; i < len; i++){
            evtArr[i].fn.apply(evtArr[i].ctx, data);
        }
        return this;
    },
    off: (name: EventName, callback: EventCallback | null = null)=>{
        let e = this.e || (this.e = {});
        let evts = e[name];
        let liveEvents = [];
        if (evts && callback) {
            for(let i = evts.length - 1; i >= 0; i--){
                if (evts[i].fn === callback || evts[i].fn._ === callback) {
                    evts.splice(i, 1);
                    break;
                }
            }
            liveEvents = evts;
        }
        liveEvents.length ? e[name] = liveEvents : delete e[name];
        return this;
    }
};
const borderStyles = {
    black: 'rgba(0,0,0,0.4)',
    white: 'rgba(255,255,255,0.4)'
} as UTSJSONObject;
function normalizeTabBarStyles(borderStyle: string | null = null) {
    if (borderStyle && borderStyle in borderStyles) {
        return borderStyles[borderStyle as keyof typeof borderStyles];
    }
    return borderStyle;
}
function normalizeTitleColor(titleColor: string) {
    return titleColor === 'black' ? '#000000' : '#ffffff';
}
function resolveStringStyleItem(modeStyle: Record<string, string>, styleItem: string, key: string | null = null) {
    if (isString(styleItem) && styleItem.startsWith('@')) {
        const _key = (styleItem as string).replace('@', '');
        let _styleItem = modeStyle![_key] || styleItem;
        switch(key){
            case 'titleColor':
                _styleItem = normalizeTitleColor(_styleItem);
                break;
            case 'borderStyle':
                _styleItem = normalizeTabBarStyles(_styleItem)!;
                break;
            default:
                break;
        }
        return _styleItem;
    }
    return styleItem;
}
function normalizeStyles<T extends object>(pageStyle: T, themeConfig: UniApp.ThemeJson = {}, mode: UniApp.ThemeMode = 'light') {
    const modeStyle = themeConfig[mode];
    const styles = {} as T;
    if (typeof modeStyle === 'undefined') return pageStyle;
    (Object.keys(pageStyle) as Array<keyof T>).forEach((key)=>{
        const styleItem = pageStyle[key];
        const parseStyleItem = ()=>{
            if (isPlainObject(styleItem)) return normalizeStyles(styleItem, themeConfig, mode);
            if (isArray(styleItem)) return styleItem.map((item: object | Array<T> | string)=>{
                if (typeof item === 'object') return normalizeStyles(item, themeConfig, mode);
                return resolveStringStyleItem(modeStyle, item);
            });
            return resolveStringStyleItem(modeStyle, styleItem as string, key as string);
        };
        styles[key] = parseStyleItem() as T[keyof T];
    });
    return styles;
}
const isObject = (val: Object): val is Record<Object, Object> =>val !== null && typeof val === 'object';
const defaultDelimiters: [string, string] = [
    '{',
    '}'
];
class BaseFormatter {
    _caches: {
        [key: string]: Array<Token>;
    };
    constructor(){
        this._caches = Object.create(null);
    }
    interpolate(message: string, values: Record<string, Object> | Array<Object> | null = null, delimiters: [string, string] = defaultDelimiters): Array<Object> {
        if (!values) {
            return [
                message
            ];
        }
        let tokens: Array<Token> = this._caches[message];
        if (!tokens) {
            tokens = parse(message, delimiters);
            this._caches[message] = tokens;
        }
        return compile(tokens, values);
    }
}
class Token extends UTSObject {
    type!: 'text' | 'named' | 'list' | 'unknown';
    value!: string;
}
const RE_TOKEN_LIST_VALUE: RegExp = /^(?:\d)+/;
const RE_TOKEN_NAMED_VALUE: RegExp = /^(?:\w)+/;
function parse(format: string, ref1: [string, string]): Array<Token> {
    let startDelimiter = ref1[0], endDelimiter = ref1[1];
    const tokens: Array<Token> = [];
    let position: number = 0;
    let text: string = '';
    while(position < format.length){
        let char: string = format[position++];
        if (char === startDelimiter) {
            if (text) {
                tokens.push({
                    type: 'text',
                    value: text
                } as UTSJSONObject);
            }
            text = '';
            let sub: string = '';
            char = format[position++];
            while(char !== undefined && char !== endDelimiter){
                sub += char;
                char = format[position++];
            }
            const isClosed = char === endDelimiter;
            const type = RE_TOKEN_LIST_VALUE.test(sub) ? 'list' : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? 'named' : 'unknown';
            tokens.push({
                value: sub,
                type
            } as UTSJSONObject);
        } else {
            text += char;
        }
    }
    text && tokens.push({
        type: 'text',
        value: text
    } as UTSJSONObject);
    return tokens;
}
function compile(tokens: Array<Token>, values: Record<string, Object> | Array<Object>): Array<Object> {
    const compiled: Array<Object> = [];
    let index: number = 0;
    const mode: string = Array.isArray(values) ? 'list' : isObject(values) ? 'named' : 'unknown';
    if (mode === 'unknown') {
        return compiled;
    }
    while(index < tokens.length){
        const token: Token = tokens[index];
        switch(token.type){
            case 'text':
                compiled.push(token.value);
                break;
            case 'list':
                compiled.push((values as Record<string, Object>)[parseInt(token.value, 10)]);
                break;
            case 'named':
                if (mode === 'named') {
                    compiled.push((values as Record<string, Object>)[token.value]);
                } else {
                    if (process.env.NODE_ENV !== 'production') {
                        console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
                    }
                }
                break;
            case 'unknown':
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(`Detect 'unknown' type of token!`);
                }
                break;
        }
        index++;
    }
    return compiled;
}
const LOCALE_ZH_HANS = 'zh-Hans';
const LOCALE_ZH_HANT = 'zh-Hant';
const LOCALE_EN = 'en';
const LOCALE_FR = 'fr';
const LOCALE_ES = 'es';
type BuiltInLocale = typeof LOCALE_ZH_HANS | typeof LOCALE_ZH_HANT | typeof LOCALE_EN | typeof LOCALE_FR | typeof LOCALE_ES;
type LocaleMessages = Record<string, Record<string, string>>;
interface Formatter {
    interpolate: (message: string, values?: Record<string, Object> | Array<Object>, delimiters?: [string, string]) => Array<Object>;
}
type LocaleWatcher = (newLocale: string, oldLocale: string) => void;
interface I18nOptions {
    locale: string;
    fallbackLocale?: string;
    messages?: LocaleMessages;
    formater?: Formatter;
    watcher?: LocaleWatcher;
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn1 = (val: object, key: string | symbol): key is keyof typeof val =>hasOwnProperty.call(val, key);
const defaultFormatter = new BaseFormatter();
function include(str: string, parts: string[]) {
    return !!parts.find((part)=>str.indexOf(part) !== -1);
}
function startsWith(str: string, parts: string[]) {
    return parts.find((part)=>str.indexOf(part) === 0);
}
function normalizeLocale(locale: string, messages: LocaleMessages | null = null): BuiltInLocale | undefined {
    if (!locale) {
        return;
    }
    locale = locale.trim().replace(/_/g, '-');
    if (messages && messages[locale as BuiltInLocale]) {
        return locale as BuiltInLocale;
    }
    locale = locale.toLowerCase();
    if (locale === 'chinese') {
        return LOCALE_ZH_HANS;
    }
    if (locale.indexOf('zh') === 0) {
        if (locale.indexOf('-hans') > -1) {
            return LOCALE_ZH_HANS;
        }
        if (locale.indexOf('-hant') > -1) {
            return LOCALE_ZH_HANT;
        }
        if (include(locale, [
            '-tw',
            '-hk',
            '-mo',
            '-cht'
        ])) {
            return LOCALE_ZH_HANT;
        }
        return LOCALE_ZH_HANS;
    }
    let locales = [
        LOCALE_EN,
        LOCALE_FR,
        LOCALE_ES
    ];
    if (messages && Object.keys(messages).length > 0) {
        locales = Object.keys(messages);
    }
    const lang = startsWith(locale, locales);
    if (lang) {
        return lang as BuiltInLocale;
    }
}
class I18n {
    private locale: string = LOCALE_EN;
    private fallbackLocale: string = LOCALE_EN;
    private message: Record<string, string> = {};
    private messages: LocaleMessages = {};
    private watchers: LocaleWatcher[] = [];
    private formater: Formatter;
    constructor(ref1: I18nOptions){
        let locale = ref1.locale, fallbackLocale = ref1.fallbackLocale, messages = ref1.messages, watcher = ref1.watcher, formater = ref1.formater;
        if (fallbackLocale) {
            this.fallbackLocale = fallbackLocale;
        }
        this.formater = formater || defaultFormatter;
        this.messages = messages || {};
        this.setLocale(locale || LOCALE_EN);
        if (watcher) {
            this.watchLocale(watcher);
        }
    }
    setLocale(locale: string) {
        const oldLocale = this.locale;
        this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
        if (!this.messages[this.locale]) {
            this.messages[this.locale] = {};
        }
        this.message = this.messages[this.locale]!;
        if (oldLocale !== this.locale) {
            this.watchers.forEach((watcher)=>{
                watcher(this.locale, oldLocale);
            });
        }
    }
    getLocale() {
        return this.locale;
    }
    watchLocale(fn: LocaleWatcher) {
        const index = this.watchers.push(fn) - 1;
        return ()=>{
            this.watchers.splice(index, 1);
        };
    }
    add(locale: BuiltInLocale, message: Record<string, string>, override: boolean = true) {
        const curMessages = this.messages[locale];
        if (curMessages) {
            if (override) {
                Object.assign(curMessages, message);
            } else {
                Object.keys(message).forEach((key)=>{
                    if (!hasOwn1(curMessages, key)) {
                        curMessages[key] = message[key];
                    }
                });
            }
        } else {
            this.messages[locale] = message;
        }
    }
    f(message: string, values: Record<string, Object> | Array<Object> | null = null, delimiters: [string, string] | null = null) {
        return this.formater.interpolate(message, values, delimiters).join('');
    }
    t(key: string, values: Record<string, Object> | Array<Object> | BuiltInLocale | null = null): string {
        return this.t(key as string, null, values as Record<string, Object> | Array<Object>) as string;
    }
    t(key: string, locale: BuiltInLocale | null = null, values: Record<string, Object> | Array<Object> | null = null): string {
        return this.t(key as string, locale as BuiltInLocale, values as Record<string, Object> | Array<Object>) as string;
    }
    t(key: string, locale: BuiltInLocale | null = null, values: Record<string, Object> | Array<Object> | null = null) {
        let message = this.message;
        if (typeof locale === 'string') {
            locale = normalizeLocale(locale, this.messages);
            locale && (message = this.messages[locale]!);
        } else {
            values = locale;
        }
        if (!hasOwn1(message, key)) {
            console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
            return key;
        }
        return this.formater.interpolate(message[key], values).join('');
    }
}
type Interpolate = (key: string, values?: Record<string, Object> | Array<Object>) => string;
function watchAppLocale(appVm: Object, i18n: I18n) {
    if (appVm.$watchLocale) {
        appVm.$watchLocale((newLocale: string)=>{
            i18n.setLocale(newLocale);
        });
    } else {
        appVm.$watch(()=>appVm.$locale, (newLocale: string)=>{
            i18n.setLocale(newLocale);
        });
    }
}
function getDefaultLocale(): string {
    if (typeof uni !== 'undefined' && .getLocale) {
        return .getLocale();
    }
    if (typeof global !== 'undefined' && (global as Object).getLocale) {
        return (global as Object).getLocale();
    }
    return LOCALE_EN;
}
function initVueI18n(locale: string | null = null, messages: LocaleMessages = {}, fallbackLocale: string | null = null, watcher: ((locale: string) => void) | null = null) {
    if (typeof locale !== 'string') {
        const options = [
            messages as Object as string,
            locale as Object as LocaleMessages
        ];
        locale = options[0] as string;
        messages = options[1] as LocaleMessages;
    }
    if (typeof locale !== 'string') {
        locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== 'string') {
        fallbackLocale = (typeof __uniConfig !== 'undefined' && __uniConfig.fallbackLocale) || LOCALE_EN;
    }
    const i18n = new I18n({
        locale,
        fallbackLocale,
        messages,
        watcher
    } as UTSJSONObject);
    let t: Interpolate = (key, values)=>{
        if (typeof getApp !== 'function') {
            t = (key, values)=>{
                return i18n.t(key, values);
            };
        } else {
            let isWatchedAppLocale = false;
            t = (key, values)=>{
                const appVm = getApp().$vm;
                if (appVm) {
                    appVm.$locale;
                    if (!isWatchedAppLocale) {
                        isWatchedAppLocale = true;
                        watchAppLocale(appVm, i18n);
                    }
                }
                return i18n.t(key, values);
            };
        }
        return t(key, values);
    };
    return {
        i18n,
        f (message: string, values: Record<string, Object> | Array<Object> | null = null, delimiters: [string, string] | null = null) {
            return i18n.f(message, values, delimiters);
        },
        t (key: string, values: Record<string, Object> | Array<Object> | null = null) {
            return t(key, values);
        },
        add (locale: BuiltInLocale, message: Record<string, string>, override: boolean = true) {
            return i18n.add(locale, message, override);
        },
        watch (fn: LocaleWatcher) {
            return i18n.watchLocale(fn);
        },
        getLocale () {
            return i18n.getLocale();
        },
        setLocale (newLocale: string) {
            return i18n.setLocale(newLocale);
        }
    };
}
function isI18nStr(value: string, delimiters: [string, string]) {
    return value.indexOf(delimiters[0]) > -1;
}
const isEnableLocale = once(()=>typeof __uniConfig !== 'undefined' && __uniConfig.locales && !!Object.keys(__uniConfig.locales).length);
let i18n: ReturnType<typeof initVueI18n>;
function getLocaleMessage() {
    const locale = .getLocale();
    const locales = __uniConfig.locales;
    return (locales[locale] || locales[__uniConfig.fallbackLocale] || locales.en || {});
}
function formatI18n(message: string) {
    if (isI18nStr(message, I18N_JSON_DELIMITERS)) {
        return useI18n().f(message, getLocaleMessage(), I18N_JSON_DELIMITERS);
    }
    return message;
}
function resolveJsonObj(jsonObj: Record<string, Object> | undefined, names: string[]): Record<string, Object> | Array<Record<string, Object>> | undefined {
    if (names.length === 1) {
        if (jsonObj) {
            const _isI18nStr = (value: Object)=>isString(value) && isI18nStr(value, I18N_JSON_DELIMITERS);
            const _name = names[0];
            let filterJsonObj: Array<Record<string, Object>> = [];
            if (isArray(jsonObj) && (filterJsonObj = jsonObj.filter((item)=>_isI18nStr(item[_name]))).length) {
                return filterJsonObj;
            }
            const value = (jsonObj as Record<string, Object>)[names[0]];
            if (_isI18nStr(value)) {
                return jsonObj;
            }
        }
        return;
    }
    const name = names.shift()!;
    return resolveJsonObj(jsonObj && jsonObj[name], names);
}
function defineI18nProperties(obj: Record<string, Object>, names: string[][]) {
    return names.map((name)=>defineI18nProperty(obj, name));
}
function defineI18nProperty(obj: Record<string, Object>, names: string[]) {
    const jsonObj = resolveJsonObj(obj, names);
    if (!jsonObj) {
        return false;
    }
    const prop = names[names.length - 1];
    if (isArray(jsonObj)) {
        jsonObj.forEach((item)=>defineI18nProperty(item, [
                prop
            ]));
    } else {
        let value = jsonObj[prop];
        Object.defineProperty(jsonObj, prop, {
            get () {
                return formatI18n(value);
            },
            set (v) {
                value = v;
            }
        } as UTSJSONObject);
    }
    return true;
}
function useI18n() {
    if (!i18n) {
        let locale: BuiltInLocale;
        locale = .getSystemInfoSync().language as BuiltInLocale;
        i18n = initVueI18n(locale);
        if (isEnableLocale()) {
            const localeKeys = Object.keys(__uniConfig.locales || {});
            if (localeKeys.length) {
                localeKeys.forEach((locale)=>i18n.add(locale as BuiltInLocale, __uniConfig.locales[locale]));
            }
            i18n.setLocale(locale);
        }
    }
    return i18n;
}
function normalizeMessages(module: string, keys: string[], values: string[]) {
    return keys.reduce((res, name, index)=>{
        res[module + name] = values[index];
        return res;
    }, {} as UTSJSONObject);
}
const initI18nAppMsgsOnce = once(()=>{
    const name = 'uni.app.';
    const keys = [
        'quit'
    ];
    if (__UNI_FEATURE_I18N_EN__) {
        useI18n().add(LOCALE_EN, normalizeMessages(name, keys, [
            'Press back button again to exit'
        ]), false);
    }
    if (__UNI_FEATURE_I18N_ES__) {
        useI18n().add(LOCALE_ES, normalizeMessages(name, keys, [
            'Pulse otra vez para salir'
        ]), false);
    }
    if (__UNI_FEATURE_I18N_FR__) {
        useI18n().add(LOCALE_FR, normalizeMessages(name, keys, [
            "Appuyez à nouveau pour quitter l'application"
        ]), false);
    }
    if (__UNI_FEATURE_I18N_ZH_HANS__) {
        useI18n().add(LOCALE_ZH_HANS, normalizeMessages(name, keys, [
            '再按一次退出应用'
        ]), false);
    }
    if (__UNI_FEATURE_I18N_ZH_HANT__) {
        useI18n().add(LOCALE_ZH_HANT, normalizeMessages(name, keys, [
            '再按一次退出應用'
        ]), false);
    }
});
function initNavigationBarI18n(navigationBar: UniApp.PageNavigationBar | PlusWebviewWebviewTitleNViewStyles) {
    if (isEnableLocale()) {
        return defineI18nProperties(navigationBar, [
            [
                'titleText'
            ],
            [
                'searchInput',
                'placeholder'
            ],
            [
                'buttons',
                'text'
            ]
        ]) as [boolean, boolean];
    }
}
function initPullToRefreshI18n(pullToRefresh: UniApp.PageRefreshOptions | PlusWebviewWebviewPullToRefreshStyles) {
    if (isEnableLocale()) {
        const CAPTION = 'caption';
        return defineI18nProperties(pullToRefresh, [
            [
                'contentdown',
                CAPTION
            ],
            [
                'contentover',
                CAPTION
            ],
            [
                'contentrefresh',
                CAPTION
            ]
        ]) as [boolean, boolean, boolean];
    }
}
function initBridge(subscribeNamespace: 'service' | 'view' | 'nvue'): Omit<UniApp.UniServiceJSBridge, 'invokeOnCallback' | 'invokeViewMethod' | 'invokeViewMethodKeepAlive' | 'publishHandler'> {
    const emitter = new E();
    return {
        on (event: string, callback: UniApp.CallbackFunction) {
            return emitter.on(event, callback);
        },
        once (event: string, callback: UniApp.CallbackFunction) {
            return emitter.once(event, callback);
        },
        off (event: string, callback: UniApp.CallbackFunction | null = null) {
            return emitter.off(event, callback);
        },
        emit (event: string, ...args: Object[]) {
            return emitter.emit(event, ...args);
        },
        subscribe (event: string, callback: UniApp.CallbackFunction, once: boolean = false): void {
            emitter[once ? 'once' : 'on'](`${subscribeNamespace}.${event}`, callback);
        },
        unsubscribe (event: string, callback: UniApp.CallbackFunction): void {
            emitter.off(`${subscribeNamespace}.${event}`, callback);
        },
        subscribeHandler (event: string, args: Object, pageId: number | null = null): void {
            emitter.emit(`${subscribeNamespace}.${event}`, args, pageId);
        }
    };
}
const INVOKE_VIEW_API = 'invokeViewApi';
const INVOKE_SERVICE_API = 'invokeServiceApi';
function hasRpx(str: string) {
    str = str + '';
    return str.indexOf('rpx') !== -1 || str.indexOf('upx') !== -1;
}
function rpx2px(str: string | number): number;
function rpx2px(str: string, replace: true): string;
function rpx2px(str: string | number, replace = false) {
    if (replace) {
        return rpx2pxWithReplace(str as string);
    }
    if (isString(str)) {
        const res = parseInt(str) || 0;
        if (hasRpx(str)) {
            return .upx2px(res);
        }
        return res;
    }
    return str;
}
function rpx2pxWithReplace(str: string) {
    if (!hasRpx(str)) {
        return str;
    }
    return str.replace(/(\d+(\.\d+)?)[ru]px/g, (_a, b)=>{
        return .upx2px(parseFloat(b)) + 'px';
    });
}
function getCurrentPage() {
    const pages = getCurrentPages();
    const len = pages.length;
    if (len) {
        return pages[len - 1];
    }
}
function getCurrentPageMeta() {
    const page = getCurrentPage();
    if (page) {
        return page.$page.meta;
    }
}
function getCurrentPageId() {
    const meta = getCurrentPageMeta();
    if (meta) {
        return meta.id!;
    }
    return -1;
}
function getCurrentPageVm() {
    const page = getCurrentPage();
    if (page) {
        return (page as Object).$vm as ComponentPublicInstance;
    }
}
const PAGE_META_KEYS = [
    'navigationBar',
    'pullToRefresh'
] as const;
function initGlobalStyle() {
    return JSON.parse(JSON.stringify(__uniConfig.globalStyle || {}));
}
function initRouteMeta(pageMeta: UniApp.PageRouteMeta, id: number | null = null): UniApp.PageRouteMeta {
    const globalStyle = initGlobalStyle();
    const res = extend({
        id
    } as UTSJSONObject, globalStyle, pageMeta);
    PAGE_META_KEYS.forEach((name)=>{
        (res as Object)[name] = extend({} as UTSJSONObject, globalStyle[name], pageMeta[name]);
    });
    const navigationBar = res.navigationBar;
    navigationBar.titleText && navigationBar.titleImage && (navigationBar.titleText = '');
    return res;
}
function normalizePullToRefreshRpx(pullToRefresh: UniApp.PageRefreshOptions) {
    if (pullToRefresh.offset) {
        pullToRefresh.offset = rpx2px(pullToRefresh.offset);
    }
    if (pullToRefresh.height) {
        pullToRefresh.height = rpx2px(pullToRefresh.height);
    }
    if (pullToRefresh.range) {
        pullToRefresh.range = rpx2px(pullToRefresh.range);
    }
    return pullToRefresh;
}
function initPageInternalInstance(openType: UniApp.OpenType, url: string, pageQuery: Record<string, Object>, meta: UniApp.PageRouteMeta, eventChannel: EventChannel | null = null, themeMode: UniApp.ThemeMode | null = null): Page.PageInstance['$page'] {
    const id = meta.id, route = meta.route;
    const titleColor = normalizeStyles(meta.navigationBar, __uniConfig.themeConfig, themeMode).titleColor;
    return {
        id: id!,
        path: addLeadingSlash(route),
        route: route,
        fullPath: url,
        options: pageQuery,
        meta,
        openType,
        eventChannel,
        statusBarStyle: titleColor === '#ffffff' ? 'light' : 'dark'
    };
}
function invokeHook(name: string, args: Object | null = null): Object;
function invokeHook(id: number, name: string, args: Object | null = null): Object;
function invokeHook(vm: ComponentPublicInstance, name: string, args: Object | null = null): Object;
function invokeHook(vm: ComponentPublicInstance | string | number, name: string | Object | null = null, args: Object | null = null) {
    if (isString(vm)) {
        args = name;
        name = vm;
        vm = getCurrentPageVm()!;
    } else if (typeof vm === 'number') {
        const page = getCurrentPages().find((page)=>page.$page.id === vm);
        if (page) {
            vm = (page as Object).$vm as ComponentPublicInstance;
        } else {
            vm = getCurrentPageVm() as ComponentPublicInstance;
        }
    }
    if (!vm) {
        return;
    }
    const hooks = (vm.$ as Object as {
        [name: string]: Function[];
    })[name as string];
    return hooks && invokeArrayFns(hooks, args);
}
function normalizeRoute(toRoute: string) {
    if (toRoute.indexOf('/') === 0) {
        return toRoute;
    }
    let fromRoute = '';
    const pages = getCurrentPages();
    if (pages.length) {
        fromRoute = (pages[pages.length - 1] as Object).$page.route;
    }
    return getRealRoute(fromRoute, toRoute);
}
function getRealRoute(fromRoute: string, toRoute: string): string {
    if (toRoute.indexOf('/') === 0) {
        return toRoute;
    }
    if (toRoute.indexOf('./') === 0) {
        return getRealRoute(fromRoute, toRoute.slice(2));
    }
    const toRouteArray = toRoute.split('/');
    const toRouteLength = toRouteArray.length;
    let i = 0;
    for(; i < toRouteLength && toRouteArray[i] === '..'; i++);
    toRouteArray.splice(0, i);
    toRoute = toRouteArray.join('/');
    const fromRouteArray = fromRoute.length > 0 ? fromRoute.split('/') : [];
    fromRouteArray.splice(fromRouteArray.length - i - 1, i + 1);
    return addLeadingSlash(fromRouteArray.concat(toRouteArray).join('/'));
}
function getRouteOptions(path: string, alias: boolean = false) {
    if (alias) {
        return __uniRoutes.find((route)=>route.path === path || route.alias === path);
    }
    return __uniRoutes.find((route)=>route.path === path);
}
function getRouteMeta(path: string) {
    const routeOptions = getRouteOptions(path);
    if (routeOptions) {
        return routeOptions.meta;
    }
}
const invokeOnCallback: UniApp.UniServiceJSBridge['invokeOnCallback'] = (name: string, res: Object)=>UniServiceJSBridge.emit('api.' + name, res);
let invokeViewMethodId = 1;
function publishViewMethodName(pageId: number | null = null) {
    return (pageId || getCurrentPageId()) + '.' + INVOKE_VIEW_API;
}
const invokeViewMethod: UniApp.UniServiceJSBridge['invokeViewMethod'] = (name: string, args: Object, pageId: number, callback: ((res: Object) => void) | null = null)=>{
    const subscribe = UniServiceJSBridge.subscribe, publishHandler = UniServiceJSBridge.publishHandler;
    const id = callback ? invokeViewMethodId++ : 0;
    callback && subscribe(INVOKE_VIEW_API + '.' + id, callback, true);
    publishHandler(publishViewMethodName(pageId), {
        id,
        name,
        args
    } as UTSJSONObject, pageId);
};
const invokeViewMethodKeepAlive: UniApp.UniServiceJSBridge['invokeViewMethodKeepAlive'] = (name: string, args: Object, callback: (res: Object) => void, pageId: number)=>{
    const subscribe = UniServiceJSBridge.subscribe, unsubscribe = UniServiceJSBridge.unsubscribe, publishHandler = UniServiceJSBridge.publishHandler;
    const id = invokeViewMethodId++;
    const subscribeName = INVOKE_VIEW_API + '.' + id;
    subscribe(subscribeName, callback);
    publishHandler(publishViewMethodName(pageId), {
        id,
        name,
        args
    } as UTSJSONObject, pageId);
    return ()=>{
        unsubscribe(subscribeName);
    };
};
type ServiceMethod<Args = Object, Res = Object> = (args: Args, publish: (res: Res) => void) => void;
const serviceMethods: Record<string, ServiceMethod<Object>> = Object.create(null);
function subscribeServiceMethod() {
    UniServiceJSBridge.subscribe(INVOKE_SERVICE_API, onInvokeServiceMethod);
}
function registerServiceMethod<Args = Object, Res = Object>(name: string, fn: ServiceMethod<Args, Res>) {
    if (!serviceMethods[name]) {
        serviceMethods[name] = fn;
    }
}
function onInvokeServiceMethod(ref1: {
    id: number;
    name: string;
    args: Object;
}, pageId: number) {
    let id = ref1.id, name = ref1.name, args = ref1.args;
    const publish = (res: Object)=>{
        id && UniServiceJSBridge.publishHandler(INVOKE_SERVICE_API + '.' + id, res, pageId);
    };
    const handler = serviceMethods[name];
    if (handler) {
        handler(args, publish);
    } else {
        publish({} as UTSJSONObject);
    }
}
const ServiceJSBridge = extend(initBridge('view'), {
    invokeOnCallback,
    invokeViewMethod,
    invokeViewMethodKeepAlive
} as UTSJSONObject);
interface LaunchOptions {
    path: string;
    query: Record<string, Object>;
    scene: number;
    referrerInfo: {
        appId: string;
        extraData: Record<string, Object>;
    };
}
function createLaunchOptions() {
    return {
        path: '',
        query: {},
        scene: 1001,
        referrerInfo: {
            appId: '',
            extraData: {}
        }
    };
}
function defineGlobalData(app: ComponentPublicInstance, defaultGlobalData: Record<string, Object> | null = null) {
    const options = app.$options || {};
    options.globalData = extend(options.globalData || {}, defaultGlobalData);
    Object.defineProperty(app, 'globalData', {
        get () {
            return options.globalData;
        },
        set (newGlobalData) {
            options.globalData = newGlobalData;
        }
    } as UTSJSONObject);
}
function initOn() {
    const on = UniServiceJSBridge.on;
    on(ON_RESIZE, onResize);
    on(ON_APP_ENTER_FOREGROUND, onAppEnterForeground);
    on(ON_APP_ENTER_BACKGROUND, onAppEnterBackground);
}
function onResize(res: UniApp.WindowResizeResult) {
    invokeHook(getCurrentPage() as ComponentPublicInstance, ON_RESIZE, res);
    UniServiceJSBridge.invokeOnCallback('onWindowResize', res);
}
function onAppEnterForeground(enterOptions: LaunchOptions) {
    const page = getCurrentPage();
    invokeHook(getApp() as ComponentPublicInstance, ON_SHOW, enterOptions);
    invokeHook(page as ComponentPublicInstance, ON_SHOW);
}
function onAppEnterBackground() {
    invokeHook(getApp() as ComponentPublicInstance, ON_HIDE);
    invokeHook(getCurrentPage() as ComponentPublicInstance, ON_HIDE);
}
const SUBSCRIBE_LIFECYCLE_HOOKS = [
    ON_PAGE_SCROLL,
    ON_REACH_BOTTOM
];
function initSubscribe() {
    SUBSCRIBE_LIFECYCLE_HOOKS.forEach((name)=>UniServiceJSBridge.subscribe(name, createPageEvent(name)));
}
function createPageEvent(name: string) {
    return (args: Object, pageId: string)=>{
        invokeHook(parseInt(pageId), name, args);
    };
}
function initService() {
    initOn();
    initSubscribe();
}
function initAppVm(appVm: ComponentPublicInstance) {
    appVm.$vm = appVm;
    appVm.$mpType = 'app';
    const locale = ref(useI18n().getLocale());
    Object.defineProperty(appVm, '$locale', {
        get () {
            return locale.value;
        },
        set (v) {
            locale.value = v;
        }
    } as UTSJSONObject);
}
function initPageVm(pageVm: ComponentPublicInstance, page: Page.PageInstance['$page']) {
    pageVm.route = page.route;
    pageVm.$vm = pageVm;
    pageVm.$page = page;
    pageVm.$mpType = 'page';
    pageVm.$fontFamilySet = new Set();
    if (page.meta.isTabBar) {
        pageVm.$.__isTabBar = true;
        pageVm.$.__isActive = true;
    }
}
function hasCallback(args: Object) {
    if (isPlainObject(args) && [
        API_SUCCESS,
        API_FAIL,
        API_COMPLETE
    ].find((cb)=>isFunction((args as Record<string, Object>)[cb]))) {
        return true;
    }
    return false;
}
const ANIMATION_IN = [
    'slide-in-right',
    'slide-in-left',
    'slide-in-top',
    'slide-in-bottom',
    'fade-in',
    'zoom-out',
    'zoom-fade-out',
    'pop-in',
    'none'
];
const API_DOWNLOAD_FILE = 'downloadFile';
const API_REQUEST = 'request';
const API_CHOOSE_VIDEO = 'chooseVideo';
const API_CHOOSE_IMAGE = 'chooseImage';
const HOOK_SUCCESS = 'success';
const HOOK_FAIL = 'fail';
const HOOK_COMPLETE = 'complete';
type HOOKS = typeof HOOK_INVOKE | typeof HOOK_SUCCESS | typeof HOOK_FAIL | typeof HOOK_COMPLETE | typeof HOOK_RETURN_VALUE;
type Interceptors = {
    [P in HOOKS]?: Function[];
};
const globalInterceptors: Interceptors = {};
const scopedInterceptors: {
    [key: string]: Interceptors;
} = {};
function formatApiArgs<T extends ApiLike>(args: Object[], options: ApiOptions<T> | null = null) {
    const params = args[0];
    if (!options || (!isPlainObject(options.formatArgs) && isPlainObject(params))) {
        return;
    }
    const formatArgs = options.formatArgs!;
    const keys = Object.keys(formatArgs);
    for(let i = 0; i < keys.length; i++){
        const name = keys[i];
        const formatterOrDefaultValue = formatArgs[name]!;
        if (isFunction(formatterOrDefaultValue)) {
            const errMsg = formatterOrDefaultValue(args[0][name], params);
            if (isString(errMsg)) {
                return errMsg;
            }
        } else {
            if (!hasOwn(params, name)) {
                params[name] = formatterOrDefaultValue;
            }
        }
    }
}
function invokeSuccess(id: number, name: string, res: Object) {
    const result: {
        errSubject?: string;
        errMsg: string;
    } = {
        errMsg: name + ':ok'
    };
    result.errSubject = name;
    return invokeCallback(id, extend((res || {}) as Object, result));
}
function invokeFail(id: number, name: string, errMsg: string | null = null, errRes: Object = {}) {
    const apiErrMsg = name + ':fail' + (errMsg ? ' ' + errMsg : '');
    let res = extend({
        errMsg: apiErrMsg
    } as UTSJSONObject, errRes);
    if (typeof UniError !== 'undefined') {
        res = typeof errRes.errCode !== 'undefined' ? new UniError(name, errRes.errCode, apiErrMsg) : new UniError(apiErrMsg, errRes);
    }
    return invokeCallback(id, res);
}
function beforeInvokeApi<T extends ApiLike>(name: string, args: Object[], protocol: ApiProtocols<T> | null = null, options: ApiOptions<T> | null = null) {
    if (options && options.beforeInvoke) {
        const errMsg = options.beforeInvoke(args);
        if (isString(errMsg)) {
            return errMsg;
        }
    }
    const errMsg = formatApiArgs(args, options);
    if (errMsg) {
        return errMsg;
    }
}
function parseErrMsg(errMsg: string | Error) {
    if (!errMsg || isString(errMsg)) {
        return errMsg;
    }
    if (errMsg.stack) {
        console.error(errMsg.message + '\n' + errMsg.stack);
        return errMsg.message;
    }
    return errMsg as Object as string;
}
function wrapperTaskApi<T extends ApiLike>(name: string, fn: Function, protocol: ApiProtocols<T> | null = null, options: ApiOptions<T> | null = null) {
    return (args: Record<string, Object>)=>{
        const id = createAsyncApiCallback(name, args, options);
        const errMsg = beforeInvokeApi(name, [
            args
        ], protocol, options);
        if (errMsg) {
            return invokeFail(id, name, errMsg);
        }
        return fn(args, {
            resolve: (res: Object)=>invokeSuccess(id, name, res),
            reject: (errMsg: string | Error, errRes: Object | null = null)=>invokeFail(id, name, parseErrMsg(errMsg), errRes)
        } as UTSJSONObject);
    };
}
function wrapperAsyncApi<T extends ApiLike>(name: string, fn: Function, protocol: ApiProtocols<T> | null = null, options: ApiOptions<T> | null = null) {
    return wrapperTaskApi(name, fn, protocol, options);
}
function wrapperHook(hook: Function, params: Record<string, Object> | null = null) {
    return (data: Object)=>{
        return hook(data, params) || data;
    };
}
function queue(hooks: Function[], data: Object, params: Record<string, Object> | null = null): Promise<Object> {
    let promise: Object = false;
    for(let i = 0; i < hooks.length; i++){
        const hook = hooks[i];
        if (promise) {
            promise = Promise.resolve(wrapperHook(hook, params));
        } else {
            const res = hook(data, params);
            if (isPromise(res)) {
                promise = Promise.resolve(res);
            }
            if (res === false) {
                return {
                    then () {},
                    catch () {}
                } as Promise<undefined>;
            }
        }
    }
    return (promise || {
        then (callback: Function) {
            return callback(data);
        },
        catch () {}
    });
}
function wrapperOptions(interceptors: Interceptors, options: Record<string, Object> = {}) {
    [
        HOOK_SUCCESS,
        HOOK_FAIL,
        HOOK_COMPLETE
    ].forEach((name)=>{
        const hooks = interceptors[name as HOOKS];
        if (!isArray(hooks)) {
            return;
        }
        const oldCallback = options[name];
        options[name] = (res: Object)=>{
            queue(hooks, res, options).then((res: Object)=>{
                return (isFunction(oldCallback) && oldCallback(res)) || res;
            });
        };
    });
    return options;
}
function wrapperReturnValue(method: string, returnValue: Object) {
    const returnValueHooks: Function[] = [];
    if (isArray(globalInterceptors.returnValue)) {
        returnValueHooks.push(...globalInterceptors.returnValue);
    }
    const interceptor = scopedInterceptors[method];
    if (interceptor && isArray(interceptor.returnValue)) {
        returnValueHooks.push(...interceptor.returnValue);
    }
    returnValueHooks.forEach((hook)=>{
        returnValue = hook(returnValue) || returnValue;
    });
    return returnValue;
}
function getApiInterceptorHooks(method: string) {
    const interceptor = Object.create(null);
    Object.keys(globalInterceptors).forEach((hook)=>{
        if (hook !== 'returnValue') {
            interceptor[hook] = (globalInterceptors[hook as HOOKS] as Function[]).slice();
        }
    });
    const scopedInterceptor = scopedInterceptors[method];
    if (scopedInterceptor) {
        Object.keys(scopedInterceptor).forEach((hook)=>{
            if (hook !== 'returnValue') {
                interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook as HOOKS]);
            }
        });
    }
    return interceptor;
}
function invokeApi(method: string, api: Function, options: object, params: Object[]) {
    const interceptor = getApiInterceptorHooks(method);
    if (interceptor && Object.keys(interceptor).length) {
        if (isArray(interceptor.invoke)) {
            const res = queue(interceptor.invoke, options);
            return res.then((options)=>{
                return api(wrapperOptions(getApiInterceptorHooks(method), options), ...params);
            });
        } else {
            return api(wrapperOptions(interceptor, options), ...params);
        }
    }
    return api(options, ...params);
}
function handlePromise(promise: Promise<Object>) {
    return promise;
}
function promisify(name: string, fn: Function) {
    return (args = {}, ...rest: Object[])=>{
        if (hasCallback(args)) {
            return wrapperReturnValue(name, invokeApi(name, fn, args, rest));
        }
        return wrapperReturnValue(name, handlePromise(new Promise((resolve, reject)=>{
            invokeApi(name, fn, extend(args, {
                success: resolve,
                fail: reject
            } as UTSJSONObject), rest);
        })));
    };
}
function defineTaskApi<T extends TaskApiLike, P extends AsyncMethodOptionLike = AsyncApiOptions<T>>(name: string, fn: (args: Omit<P, CALLBACK_TYPES>, res: {
    resolve: (res?: AsyncApiRes<P> | void) => void;
    reject: <R extends object>(err?: string, errRes?: R & object) => void;
}) => ReturnType<T>, protocol: ApiProtocols<T> | null = null, options: ApiOptions<T> | null = null) {
    return promisify(name, wrapperTaskApi(name, fn, undefined, options)) as Object as T;
}
type DefineAsyncApiFn<T extends AsyncApiLike, P extends AsyncMethodOptionLike = AsyncApiOptions<T>> = (args: P extends undefined ? undefined : Omit<P, CALLBACK_TYPES>, res: {
    resolve: (res: AsyncApiRes<P> | void) => void;
    reject: (errMsg?: string, errRes?: Object) => void;
}) => void;
function defineAsyncApi<T extends AsyncApiLike, P extends AsyncMethodOptionLike = AsyncApiOptions<T>>(name: string, fn: DefineAsyncApiFn<T>, protocol: ApiProtocols<T> | null = null, options: ApiOptions<T> | null = null) {
    return promisify(name, wrapperAsyncApi(name, fn as Object, undefined, options)) as AsyncApi<P>;
}
function getRealPath(filepath: string) {
    return filepath;
}
declare function vp2px(value: number): number;
const CHOOSE_SIZE_TYPES = [
    'original',
    'compressed'
];
declare function lpx2px(value: number): number;
function getBaseSystemInfo() {
    return {
        platform: 'harmony',
        pixelRatio: vp2px(1),
        windowWidth: lpx2px(720)
    };
}
type AppShowHook = (options: UniApp.GetLaunchOptionsSyncOptions) => void;
const API_GET_IMAGE_INFO = 'getImageInfo';
const API_GET_VIDEO_INFO = 'getVideoInfo';
const API_UPLOAD_FILE = 'uploadFile';
const CHOOSE_SOURCE_TYPES = [
    'album',
    'camera'
];
const HTTP_METHODS = [
    'GET',
    'OPTIONS',
    'HEAD',
    'POST',
    'PUT',
    'DELETE',
    'TRACE',
    'CONNECT',
    'PATCH'
];
function elemInArray<T = string>(str: T, arr: T[]) {
    if (!str || arr.indexOf(str) === -1) {
        return arr[0];
    }
    return str;
}
const ANIMATION_OUT = [
    'slide-out-right',
    'slide-out-left',
    'slide-out-top',
    'slide-out-bottom',
    'fade-out',
    'zoom-in',
    'zoom-fade-in',
    'pop-out',
    'none'
];
const BaseRouteProtocol: ApiProtocol<API_TYPE_NAVIGATE_TO> = {
    url: {
        type: String,
        required: true
    }
};
const API_NAVIGATE_TO = 'navigateTo';
type API_TYPE_NAVIGATE_TO = typeof uni.navigateTo;
const API_REDIRECT_TO = 'redirectTo';
const API_SWITCH_TAB = 'switchTab';
type API_TYPE_SWITCH_TAB = typeof uni.switchTab;
const API_NAVIGATE_BACK = 'navigateBack';
type API_TYPE_NAVIGATE_BACK = typeof uni.navigateBack1;
const API_PRELOAD_PAGE = 'preloadPage';
const API_UN_PRELOAD_PAGE = 'unPreloadPage';
const NavigateToProtocol: ApiProtocol<API_TYPE_NAVIGATE_TO> = extend({} as UTSJSONObject, BaseRouteProtocol, createAnimationProtocol(ANIMATION_IN));
const NavigateBackProtocol: ApiProtocol<API_TYPE_NAVIGATE_BACK> = extend({
    delta: {
        type: Number
    }
} as UTSJSONObject, createAnimationProtocol(ANIMATION_OUT));
const NavigateToOptions: ApiOptions<API_TYPE_NAVIGATE_TO> = createRouteOptions(API_NAVIGATE_TO);
const NavigateBackOptions: ApiOptions<API_TYPE_NAVIGATE_BACK> = {
    formatArgs: {
        delta (value, params) {
            value = parseInt(value + '') || 1;
            params.delta = Math.min(getCurrentPages().length - 1, value);
        }
    }
};
function createAnimationProtocol(animationTypes: string[]) {
    return {
        animationType: {
            type: String as Object,
            validator (type: string | null = null) {
                if (type && animationTypes.indexOf(type) === -1) {
                    return ('`' + type + '` is not supported for `animationType` (supported values are: `' + animationTypes.join('`|`') + '`)');
                }
            }
        },
        animationDuration: {
            type: Number
        }
    };
}
let navigatorLock: string;
function beforeRoute() {
    navigatorLock = '';
}
function createRouteOptions(type: string): ApiOptions<API_TYPE_NAVIGATE_TO> {
    return {
        formatArgs: {
            url: createNormalizeUrl(type)
        },
        beforeAll: beforeRoute
    };
}
function createNormalizeUrl(type: string) {
    return (url: string, params: Record<string, Object>)=>{
        if (!url) {
            return `Missing required args: "url"`;
        }
        url = normalizeRoute(url);
        const pagePath = url.split('?')[0];
        const routeOptions = getRouteOptions(pagePath, true);
        if (!routeOptions) {
            return 'page `' + url + '` is not found';
        }
        if (type === API_NAVIGATE_TO || type === API_REDIRECT_TO) {
            if (routeOptions.meta.isTabBar) {
                return `can not ${type} a tabbar page`;
            }
        } else if (type === API_SWITCH_TAB) {
            if (!routeOptions.meta.isTabBar) {
                return 'can not switch to no-tabBar page';
            }
        }
        if ((type === API_SWITCH_TAB || type === API_PRELOAD_PAGE) && routeOptions.meta.isTabBar && params.openType !== 'appLaunch') {
            url = pagePath;
        }
        if (routeOptions.meta.isEntry) {
            url = url.replace(routeOptions.alias!, '/');
        }
        params.url = encodeQueryString(url);
        if (type === API_UN_PRELOAD_PAGE) {
            return;
        } else if (type === API_PRELOAD_PAGE) {
            if (routeOptions.meta.isTabBar) {
                const pages = getCurrentPages();
                const tabBarPagePath = routeOptions.path.slice(1);
                if (pages.find((page)=>page.route === tabBarPagePath)) {
                    return 'tabBar page `' + tabBarPagePath + '` already exists';
                }
            }
            return;
        }
        if (navigatorLock === url && params.openType !== 'appLaunch') {
            return `${navigatorLock} locked`;
        }
        if (__uniConfig.ready) {
            navigatorLock = url;
        }
    };
}
type API_TYPE_DOWNLOAD_FILE = typeof uni.downloadFile;
const DownloadFileOptions: ApiOptions<API_TYPE_DOWNLOAD_FILE> = {
    formatArgs: {
        header (value: Record<string, Object>, params: Record<string, Object>) {
            params.header = value || {};
        }
    }
};
const DownloadFileProtocol: ApiProtocol<API_TYPE_DOWNLOAD_FILE> = {
    url: {
        type: String,
        required: true
    },
    header: Object,
    timeout: Number
};
type API_TYPE_REQUEST = typeof uni.request;
const dataType = {
    JSON: 'json'
} as UTSJSONObject;
const RESPONSE_TYPE = [
    'text',
    'arraybuffer'
];
const DEFAULT_RESPONSE_TYPE = 'text';
const encode1 = encodeURIComponent;
function stringifyQuery1(url: string, data: Record<string, Object>) {
    let str = url.split('#');
    const hash = str[1] || '';
    str = str[0].split('?');
    let query = str[1] || '';
    url = str[0];
    const search = query.split('&').filter((item)=>item);
    const params: Record<string, string> = {};
    search.forEach((item)=>{
        const part = item.split('=');
        params[part[0]] = part[1];
    });
    for(const key in data){
        if (hasOwn(data, key)) {
            let v = data[key];
            if (typeof v === 'undefined' || v === null) {
                v = '';
            } else if (isPlainObject(v)) {
                v = JSON.stringify(v);
            }
            params[encode1(key)] = encode1(v);
        }
    }
    query = Object.keys(params).map((item)=>`${item}=${params[item]}`).join('&');
    return url + (query ? '?' + query : '') + (hash ? '#' + hash : '');
}
const RequestProtocol: ApiProtocol<API_TYPE_REQUEST> = {
    method: String as Object,
    data: [
        Object,
        String,
        Array,
        ArrayBuffer
    ],
    url: {
        type: String,
        required: true
    },
    header: Object,
    dataType: String,
    responseType: String,
    withCredentials: Boolean
};
const RequestOptions: ApiOptions<API_TYPE_REQUEST> = {
    formatArgs: {
        method (value, params) {
            params.method = elemInArray((value || '').toUpperCase(), HTTP_METHODS) as Object;
        },
        data (value, params) {
            params.data = value || '';
        },
        url (value, params) {
            if (params.method === HTTP_METHODS[0] && isPlainObject(params.data) && Object.keys(params.data).length) {
                params.url = stringifyQuery1(value, params.data);
            }
        },
        header (value: Record<string, Object>, params: Record<string, Object>) {
            const header = params.header = value || {};
            if (params.method !== HTTP_METHODS[0]) {
                if (!Object.keys(header).find((key)=>key.toLowerCase() === 'content-type')) {
                    header['Content-Type'] = 'application/json';
                }
            }
        },
        dataType (value, params) {
            params.dataType = (value || dataType.JSON).toLowerCase();
        },
        responseType (value, params) {
            params.responseType = (value || '').toLowerCase();
            if (RESPONSE_TYPE.indexOf(params.responseType) === -1) {
                params.responseType = DEFAULT_RESPONSE_TYPE;
            }
        }
    }
};
function elemsInArray(strArr: string[] | string | undefined, optionalVal: string[]) {
    if (!isArray(strArr) || strArr.length === 0 || strArr.find((val)=>optionalVal.indexOf(val) === -1)) {
        return optionalVal;
    }
    return strArr;
}
type API_TYPE_CHOOSE_VIDEO = typeof uni.chooseVideo;
const ChooseVideoOptions: ApiOptions<API_TYPE_CHOOSE_VIDEO> = {
    formatArgs: {
        sourceType (sourceType, params) {
            params.sourceType = elemsInArray(sourceType, CHOOSE_SOURCE_TYPES);
        },
        compressed: true,
        maxDuration: 60,
        camera: 'back',
        extension (extension, params) {
            if (extension instanceof Array && extension.length === 0) {
                return 'param extension should not be empty.';
            }
            if (!extension) params.extension = [
                '*'
            ];
        }
    }
};
const ChooseVideoProtocol: ApiProtocol<API_TYPE_CHOOSE_VIDEO> = {
    sourceType: Array,
    compressed: Boolean,
    maxDuration: Number,
    camera: String as Object,
    extension: Array
};
type API_TYPE_CHOOSE_IMAGE = typeof uni.chooseImage;
const ChooseImageOptions: ApiOptions<API_TYPE_CHOOSE_IMAGE> = {
    formatArgs: {
        count (value, params) {
            if (!value || value <= 0) {
                params.count = 9;
            }
        },
        sizeType (sizeType, params) {
            params.sizeType = elemsInArray(sizeType, CHOOSE_SIZE_TYPES);
        },
        sourceType (sourceType, params) {
            params.sourceType = elemsInArray(sourceType, CHOOSE_SOURCE_TYPES);
        },
        extension (extension, params) {
            if (extension instanceof Array && extension.length === 0) {
                return 'param extension should not be empty.';
            }
            if (!extension) params.extension = [
                '*'
            ];
        }
    }
};
const ChooseImageProtocol: ApiProtocol<API_TYPE_CHOOSE_IMAGE> = {
    count: Number,
    sizeType: [
        Array,
        String
    ],
    sourceType: Array,
    extension: Array
};
const env = {
    USER_DATA_PATH: '',
    TEMP_PATH: '',
    CACHE_PATH: ''
} as UTSJSONObject;
declare function getContext(): Context;
function initEnv() {
    const context = getContext();
    env.USER_DATA_PATH = context.filesDir;
    env.TEMP_PATH = context.tempDir;
    env.CACHE_PATH = context.cacheDir;
    return env;
}
const initEnvOnce = once(initEnv);
function getEnv() {
    return initEnvOnce();
}
type AppHideHook = () => void;
interface AppHooks {
    onUnhandledRejection: UniApp.OnUnhandledRejectionCallback[];
    onPageNotFound: UniApp.OnPageNotFoundCallback[];
    onError: UniApp.OnAppErrorCallback[];
    onShow: AppShowHook[];
    onHide: AppHideHook[];
}
const appHooks: AppHooks = {
    [ON_UNHANDLE_REJECTION]: [],
    [ON_PAGE_NOT_FOUND]: [],
    [ON_ERROR]: [],
    [ON_SHOW]: [],
    [ON_HIDE]: []
};
function injectAppHooks(appInstance: ComponentInternalInstance) {
    Object.keys(appHooks).forEach((type)=>{
        appHooks[type as keyof AppHooks].forEach((hook)=>{
            injectHook(type, hook, appInstance);
        });
    });
}
type API_TYPE_GET_IMAGE_INFO = typeof uni.getImageInfo;
const GetImageInfoOptions: ApiOptions<API_TYPE_GET_IMAGE_INFO> = {
    formatArgs: {
        src (src, params) {
            params.src = getRealPath(src);
        }
    }
};
const GetImageInfoProtocol: ApiProtocol<API_TYPE_GET_IMAGE_INFO> = {
    src: {
        type: String,
        required: true
    }
};
type API_TYPE_GET_VIDEO_INFO = typeof uni.getVideoInfo;
const GetVideoInfoOptions: ApiOptions<API_TYPE_GET_VIDEO_INFO> = {
    formatArgs: {
        src (src, params) {
            params.src = getRealPath(src);
        }
    }
};
const GetVideoInfoProtocol: ApiProtocol<API_TYPE_GET_VIDEO_INFO> = {
    src: {
        type: String,
        required: true
    }
};
type API_TYPE_UPLOAD_FILE = typeof uni.uploadFile;
const UploadFileOptions: ApiOptions<API_TYPE_UPLOAD_FILE> = {
    formatArgs: {
        filePath (filePath, params) {
            if (filePath) {
                params.filePath = getRealPath(filePath);
            }
        },
        header (value: Record<string, Object>, params: Record<string, Object>) {
            params.header = value || {};
        },
        formData (value: Record<string, Object>, params: Record<string, Object>) {
            params.formData = value || {};
        }
    }
};
const UploadFileProtocol: ApiProtocol<API_TYPE_UPLOAD_FILE> = {
    url: {
        type: String,
        required: true
    },
    files: Array,
    filePath: String,
    name: String,
    header: Object,
    formData: Object,
    timeout: Number
};
const chooseImage: API_TYPE_CHOOSE_IMAGE = defineAsyncApi(API_CHOOSE_IMAGE, ({ count  } = {}, ref1)=>{
    let resolve = ref1.resolve, reject = ref1.reject;
    _chooseMedia({
        mimeType: picker1.PhotoViewMIMETypes.IMAGE_TYPE,
        count
    } as UTSJSONObject).then((res)=>{
        return {
            tempFilePaths: res.tempFiles.map((file)=>file.tempFilePath),
            tempFiles: res.tempFiles.map((file)=>{
                return {
                    path: file.tempFilePath,
                    size: file.size
                };
            })
        };
    }).then(resolve, reject);
}, ChooseImageProtocol, ChooseImageOptions);
const chooseVideo: API_TYPE_CHOOSE_VIDEO = defineAsyncApi(API_CHOOSE_VIDEO, ({} = {}, ref1)=>{
    let resolve = ref1.resolve, reject = ref1.reject;
    _chooseMedia({
        mimeType: picker2.PhotoViewMIMETypes.VIDEO_TYPE
    } as UTSJSONObject).then((res)=>{
        const file = res.tempFiles[0];
        return {
            tempFilePath: file.tempFilePath,
            duration: file.duration,
            size: file.size,
            width: file.width,
            height: file.height
        };
    }).then(resolve, reject);
}, ChooseVideoProtocol, ChooseVideoOptions);
const getImageInfo: API_TYPE_GET_IMAGE_INFO = defineAsyncApi(API_GET_IMAGE_INFO, (ref1, ref2)=>{
    let src = ref1.src, resolve = ref2.resolve, reject = ref2.reject;
    _getImageInfo(src).then(resolve, reject);
}, GetImageInfoProtocol, GetImageInfoOptions);
const getVideoInfo: API_TYPE_GET_VIDEO_INFO = defineAsyncApi(API_GET_VIDEO_INFO, (ref1, ref2)=>{
    let src = ref1.src, resolve = ref2.resolve, reject = ref2.reject;
    _getVideoInfo(src).then((res)=>{
        return {
            size: res.size,
            duration: res.duration!,
            width: res.width!,
            height: res.height!,
            type: res.type!,
            orientation: res.orientation!
        };
    }).then(resolve, reject);
}, GetVideoInfoProtocol, GetVideoInfoOptions);
const cookiesParse = (header: Record<string, string>)=>{
    let cookiesStr = header['Set-Cookie'] || header['set-cookie'];
    let cookiesArr: string[] = [];
    if (!cookiesStr) {
        return [];
    }
    if (cookiesStr[0] === '[' && cookiesStr[cookiesStr.length - 1] === ']') {
        cookiesStr = cookiesStr.slice(1, -1);
    }
    const handleCookiesArr = cookiesStr.split(';');
    for(let i = 0; i < handleCookiesArr.length; i++){
        if (handleCookiesArr[i].indexOf('Expires=') !== -1 || handleCookiesArr[i].indexOf('expires=') !== -1) {
            cookiesArr.push(handleCookiesArr[i].replace(',', ''));
        } else {
            cookiesArr.push(handleCookiesArr[i]);
        }
    }
    cookiesArr = cookiesArr.join(';').split(',');
    return cookiesArr;
};
interface IRequestTask {
    abort: Function;
    onHeadersReceived: Function;
    offHeadersReceived: Function;
}
class RequestTask implements UniApp.RequestTask {
    private _requestTask: IRequestTask;
    constructor(requestTask: IRequestTask){
        this._requestTask = requestTask;
    }
    abort() {
        this._requestTask.abort();
    }
    onHeadersReceived(callback: Function) {
        this._requestTask.onHeadersReceived(callback);
    }
    offHeadersReceived(callback: Function | null = null) {
        this._requestTask.offHeadersReceived(callback);
    }
}
const request = defineTaskApi(API_REQUEST, (args, ref1)=>{
    let resolve = ref1.resolve, reject = ref1.reject;
    let header = args.header, method = args.method, data = args.data, dataType = args.dataType, timeout = args.timeout, url = args.url, responseType = args.responseType;
    let contentType;
    const headers = {} as Record<string, Object>;
    for(const name in header){
        if (name.toLowerCase() === 'content-type') {
            contentType = header[name];
        }
        headers[name.toLowerCase()] = header[name];
    }
    if (!contentType && method === 'POST') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }
    if (method === 'GET' && data && isPlainObject(data)) {
        url += '?' + Object.keys(data).map((key)=>{
            return (encodeURIComponent(key) + '=' + encodeURIComponent((data as Object)[key]));
        }).join('&');
        data = undefined;
    } else if (method !== 'GET' && contentType && contentType.indexOf('application/json') === 0 && isPlainObject(data)) {
        data = JSON.stringify(data);
    } else if (method !== 'GET' && contentType && contentType.indexOf('application/x-www-form-urlencoded') === 0 && isPlainObject(data)) {
        data = Object.keys(data).map((key)=>{
            return (encodeURIComponent(key) + '=' + encodeURIComponent((data as Object)[key]));
        }).join('&');
    }
    let expectDataType: http.HttpDataType = http.HttpDataType.STRING;
    if (responseType === 'arraybuffer') {
        expectDataType = http.HttpDataType.ARRAY_BUFFER;
    } else if (dataType === 'json') {
        expectDataType = http.HttpDataType.OBJECT;
    } else {
        expectDataType = http.HttpDataType.STRING;
    }
    const httpRequest = http.createHttp();
    const emitter = new E();
    const requestTask = {
        abort () {
            httpRequest.destroy();
        },
        onHeadersReceived (callback: Function) {
            emitter.on('headersReceive', callback);
        },
        offHeadersReceived (callback: Function | null = null) {
            emitter.off('headersReceive', callback);
        }
    } as UTSJSONObject;
    httpRequest.on('headersReceive', (header: Object)=>{});
    httpRequest.request(url, {
        header: headers,
        method: (method || 'GET').toUpperCase() as http.RequestMethod,
        extraData: data,
        expectDataType,
        connectTimeout: timeout,
        readTimeout: timeout
    } as UTSJSONObject, (err, res)=>{
        if (err) {
            reject(err.message);
        } else {
            resolve({
                data: res.result,
                statusCode: res.responseCode,
                header: res.header,
                cookies: cookiesParse(res.header as Record<string, Object>)
            } as UTSJSONObject);
        }
        requestTask.offHeadersReceived();
        httpRequest.destroy();
    });
    return new RequestTask(requestTask);
}, RequestProtocol, RequestOptions);
interface IUploadTask {
    abort: Function;
    onHeadersReceived: Function;
    offHeadersReceived: Function;
    onProgressUpdate: Function;
    offProgressUpdate: Function;
}
class UploadTask implements UniApp.UploadTask {
    private _uploadTask: IUploadTask;
    constructor(uploadTask: IUploadTask){
        this._uploadTask = uploadTask;
    }
    abort() {
        this._uploadTask.abort();
    }
    onProgressUpdate(callback: Function) {
        this._uploadTask.onProgressUpdate(callback);
    }
    offProgressUpdate(callback: Function | null = null) {
        this._uploadTask.offProgressUpdate(callback);
    }
    onHeadersReceived(callback: Function) {
        this._uploadTask.onHeadersReceived(callback);
    }
    offHeadersReceived(callback: Function | null = null) {
        this._uploadTask.offHeadersReceived(callback);
    }
}
const uploadFile = defineTaskApi(API_UPLOAD_FILE, (args, ref1)=>{
    let resolve = ref1.resolve, reject = ref1.reject;
    let url = args.url, timeout = args.timeout, header = args.header, formData = args.formData, files = args.files, filePath = args.filePath, name = args.name;
    const headers = {} as Record<string, Object>;
    for(const name in header){
        headers[name.toLowerCase()] = header[name];
    }
    headers['Content-Type'] = 'multipart/form-data';
    const multiFormDataList = [] as Array<http1.MultiFormData>;
    for(const name in formData){
        if (hasOwn(formData, name)) {
            multiFormDataList.push({
                name,
                contentType: 'text/plain',
                data: String(formData[name])
            } as UTSJSONObject);
        }
    }
    if (files && files.length) {
        for(let i = 0; i < files.length; i++){
            const _files_i = files[i], name = _files_i.name, uri = _files_i.uri;
            multiFormDataList.push({
                name: name || 'file',
                contentType: 'application/octet-stream',
                filePath: getRealPath(uri!)
            } as UTSJSONObject);
        }
    } else {
        multiFormDataList.push({
            name: name || 'file',
            contentType: 'application/octet-stream',
            filePath: getRealPath(filePath!)
        } as UTSJSONObject);
    }
    const httpRequest = http1.createHttp();
    const emitter = new E();
    const uploadTask: IUploadTask = {
        abort () {
            httpRequest.destroy();
        },
        onHeadersReceived (callback: Function) {
            emitter.on('headersReceive', callback);
        },
        offHeadersReceived (callback: Function | null = null) {
            emitter.off('headersReceive', callback);
        },
        onProgressUpdate (callback: Function) {
            emitter.on('progress', callback);
        },
        offProgressUpdate (callback: Function | null = null) {
            emitter.off('progress', callback);
        }
    };
    httpRequest.on('headersReceive', (header: Object)=>{});
    httpRequest.on('dataSendProgress', (ref1)=>{
        let sendSize = ref1.sendSize, totalSize = ref1.totalSize;
        emitter.emit('progress', {
            progress: Math.floor((sendSize / totalSize) * 100),
            totalBytesSent: sendSize,
            totalBytesExpectedToSend: totalSize
        } as UTSJSONObject);
    });
    httpRequest.request(url, {
        header: headers,
        method: http1.RequestMethod.POST,
        connectTimeout: timeout,
        readTimeout: timeout,
        multiFormDataList,
        expectDataType: http1.HttpDataType.STRING
    } as UTSJSONObject, (err, res)=>{
        if (err) {
            reject(err.message);
        } else {
            resolve({
                data: res.result as string,
                statusCode: res.responseCode
            } as UTSJSONObject);
        }
        uploadTask.offHeadersReceived();
        uploadTask.offProgressUpdate();
        httpRequest.destroy();
    });
    return new UploadTask(uploadTask);
}, UploadFileProtocol, UploadFileOptions);
interface IDownloadTask {
    abort: Function;
    onHeadersReceived: Function;
    offHeadersReceived: Function;
    onProgressUpdate: Function;
    offProgressUpdate: Function;
}
class DownloadTask implements UniApp.DownloadTask {
    private _downloadTask: IDownloadTask;
    constructor(downloadTask: IDownloadTask){
        this._downloadTask = downloadTask;
    }
    abort() {
        this._downloadTask.abort();
    }
    onProgressUpdate(callback: Function) {
        this._downloadTask.onProgressUpdate(callback);
    }
    offProgressUpdate(callback: Function | null = null) {
        this._downloadTask.offProgressUpdate(callback);
    }
    onHeadersReceived(callback: Function) {
        this._downloadTask.onHeadersReceived(callback);
    }
    offHeadersReceived(callback: Function | null = null) {
        this._downloadTask.offHeadersReceived(callback);
    }
}
const downloadFile = defineTaskApi(API_DOWNLOAD_FILE, (args, ref1)=>{
    let resolve = ref1.resolve, reject = ref1.reject;
    let url = args.url, timeout = args.timeout, header = args.header;
    const httpRequest = http2.createHttp();
    const emitter = new E();
    const downloadTask: IDownloadTask = {
        abort () {
            httpRequest.destroy();
        },
        onHeadersReceived (callback: Function) {
            emitter.on('headersReceive', callback);
        },
        offHeadersReceived (callback: Function | null = null) {
            emitter.off('headersReceive', callback);
        },
        onProgressUpdate (callback: Function) {
            emitter.on('progress', callback);
        },
        offProgressUpdate (callback: Function | null = null) {
            emitter.off('progress', callback);
        }
    };
    httpRequest.on('headersReceive', (header: Object)=>{});
    httpRequest.on('dataReceiveProgress', (ref1)=>{
        let receiveSize = ref1.receiveSize, totalSize = ref1.totalSize;
        emitter.emit('progress', {
            progress: Math.floor((receiveSize / totalSize) * 100),
            totalBytesWritten: receiveSize,
            totalBytesExpectedToWrite: totalSize
        } as UTSJSONObject);
    });
    const TEMP_PATH = getEnv().TEMP_PATH;
    const tempFilePath = TEMP_PATH + '/download/' + Date.now() + '.tmp';
    const stream = fs1.createStreamSync(tempFilePath, 'w+');
    let writePromise = Promise.resolve(0);
    const queueWrite = async (data: ArrayBuffer): Promise<number> =>{
        writePromise = writePromise.then(async (total)=>{
            const length = await stream.write(data);
            return total + length;
        });
        return writePromise;
    };
    httpRequest.on('dataReceive', (data)=>{
        queueWrite(data);
    });
    httpRequest.requestInStream(url, {
        header,
        method: http2.RequestMethod.GET,
        connectTimeout: timeout,
        readTimeout: timeout
    } as UTSJSONObject, (err, statusCode)=>{
        if (err) {
            reject(err.message);
        } else {
            writePromise.then(()=>{
                stream.flushSync();
                stream.closeSync();
                resolve({
                    tempFilePath,
                    statusCode
                } as UTSJSONObject);
            });
        }
        downloadTask.offHeadersReceived();
        downloadTask.offProgressUpdate();
        httpRequest.destroy();
    });
    return new DownloadTask(downloadTask);
}, DownloadFileProtocol, DownloadFileOptions);
function getLocale() {
    return 'zh-CN';
}
function getSystemInfoSync() {
    return getBaseSystemInfo();
}
const downgrade = false && plus.os.name === 'Android' && parseInt(plus.os.version!) < 6;
const ANI_SHOW = downgrade ? 'slide-in-right' : 'pop-in';
const ANI_CLOSE = downgrade ? 'slide-out-right' : 'pop-out';
const VIEW_WEBVIEW_PATH = '_www/__uniappview.html';
const WEBVIEW_ID_PREFIX = 'webviewId';
const VD_SYNC = 'vdSync';
const ON_WEBVIEW_READY = 'onWebviewReady';
let ACTION_MINIFY = true;
type Value = string | number | boolean | null;
type Dictionary = Value[];
type DictAction = [typeof ACTION_TYPE_DICT, Dictionary];
const WEBVIEW_INSERTED = 'webviewInserted';
const WEBVIEW_REMOVED = 'webviewRemoved';
const pages: ComponentPublicInstance[] = [];
interface VueApp extends App {
    mountPage: (pageComponent: VuePageComponent, pageProps: Record<string, Object>, pageContainer: UniNode) => ComponentPublicInstance;
    unmountPage: (pageInstance: ComponentPublicInstance) => void;
}
type VuePageComponent = DefineComponent<PageProps>;
class UniPageNode extends UniNode implements IUniPageNode {
    pageId: number;
    private _id: number = 1;
    private _created: boolean = false;
    private _updating: boolean = false;
    private options: PageNodeOptions;
    private createAction: PageCreateAction;
    private createdAction: PageCreatedAction;
    private scrollAction?: PageScrollAction;
    private _createActionMap = new Map<number, CreateAction>();
    updateActions: (PageAction | DictAction)[] = [];
    dicts: Dictionary = [];
    normalizeDict: (value: Object, normalizeValue?: boolean) => Object | number;
    isUnmounted: boolean;
    private _update: () => void;
    constructor(pageId: number, options: PageNodeOptions, setup: boolean = false){
        super(0, '#page', null as Object as IUniPageNode);
        this.nodeId = 0;
        this.pageId = pageId;
        this.pageNode = this;
        this.options = options;
        this.isUnmounted = false;
        this.createAction = [
            ACTION_TYPE_PAGE_CREATE,
            options
        ];
        this.createdAction = [
            ACTION_TYPE_PAGE_CREATED
        ];
        this.normalizeDict = this._normalizeDict.bind(this);
        this._update = this.update.bind(this);
        setup && this.setup();
    }
    _normalizeDict(value: Object, normalizeValue: boolean = true) {
        if (!ACTION_MINIFY) {
            return value;
        }
        if (!isPlainObject(value)) {
            return this.addDict(value as Value);
        }
        const dictArray: [number, number][] = [];
        Object.keys(value).forEach((n)=>{
            const dict = [
                this.addDict(n) as number
            ];
            const v = value[n as keyof typeof value] as Value;
            if (normalizeValue) {
                dict.push(this.addDict(v) as number);
            } else {
                dict.push(v as number);
            }
            dictArray.push(dict as [number, number]);
        });
        return dictArray;
    }
    addDict<T extends Value>(value: T): T | number {
        if (!ACTION_MINIFY) {
            return value;
        }
        const dicts = this.dicts;
        const index = dicts.indexOf(value);
        if (index > -1) {
            return index;
        }
        return dicts.push(value) - 1;
    }
    onInjectHook(hook: string) {
        if ((hook === ON_PAGE_SCROLL || hook === ON_REACH_BOTTOM) && !this.scrollAction) {
            this.scrollAction = [
                ACTION_TYPE_PAGE_SCROLL,
                this.options.onReachBottomDistance
            ];
            this.push(this.scrollAction);
        }
    }
    onCreate(thisNode: UniNode, nodeName: string | number) {
        pushCreateAction(this, thisNode.nodeId!, nodeName);
        return thisNode;
    }
    onInsertBefore(thisNode: UniNode, newChild: UniNode, refChild: UniNode | null) {
        pushInsertAction(this, newChild as UniBaseNode, thisNode.nodeId!, (refChild && refChild.nodeId!) || -1);
        return newChild;
    }
    onRemoveChild(oldChild: UniNode) {
        pushRemoveAction(this, oldChild.nodeId!);
        return oldChild;
    }
    onAddEvent(thisNode: UniNode, name: string, flag: number) {
        if (thisNode.parentNode) {
            pushAddEventAction(this, thisNode.nodeId!, name, flag);
        }
    }
    onAddWxsEvent(thisNode: UniNode, name: string, wxsEvent: string, flag: number) {
        if (thisNode.parentNode) {
            pushAddWxsEventAction(this, thisNode.nodeId!, name, wxsEvent, flag);
        }
    }
    onRemoveEvent(thisNode: UniNode, name: string) {
        if (thisNode.parentNode) {
            pushRemoveEventAction(this, thisNode.nodeId!, name);
        }
    }
    onSetAttribute(thisNode: UniNode, qualifiedName: string, value: Object) {
        if (thisNode.parentNode) {
            pushSetAttributeAction(this, thisNode.nodeId!, qualifiedName, value);
        }
    }
    onRemoveAttribute(thisNode: UniNode, qualifiedName: string) {
        if (thisNode.parentNode) {
            pushRemoveAttributeAction(this, thisNode.nodeId!, qualifiedName);
        }
    }
    onTextContent(thisNode: UniNode, text: string) {
        if (thisNode.parentNode) {
            pushSetTextAction(this, thisNode.nodeId!, text);
        }
    }
    onNodeValue(thisNode: UniNode, val: string | null) {
        if (thisNode.parentNode) {
            pushSetTextAction(this, thisNode.nodeId!, val as string);
        }
    }
    genId() {
        return this._id++;
    }
    push(action: PageAction, extras: Object | null = null) {
        if (this.isUnmounted) {
            return;
        }
        switch(action[0]){
            case 3:
                this._createActionMap.set(action[1], action);
                break;
            case 4:
                const createAction = this._createActionMap.get(action[1]);
                if (createAction) {
                    createAction[3] = action[2];
                    createAction[4] = action[3];
                    if (extras) {
                        createAction[5] = extras as UniNodeJSON;
                    }
                } else {
                    if (extras) {
                        action[4] = extras as UniNodeJSON;
                    }
                    this.updateActions.push(action);
                }
                break;
        }
        if (action[0] !== 4) {
            this.updateActions.push(action);
        }
        if (!this._updating) {
            this._updating = true;
            queuePostFlushCb(this._update);
        }
    }
    restore() {
        this.clear();
        this.setup();
        if (this.scrollAction) {
            this.push(this.scrollAction);
        }
        const restoreNode = (node: UniNode)=>{
            this.onCreate(node, node.nodeName);
            this.onInsertBefore(node.parentNode!, node, null);
            node.childNodes.forEach((childNode)=>{
                restoreNode(childNode);
            });
        };
        this.childNodes.forEach((childNode)=>restoreNode(childNode));
        this.push(this.createdAction);
    }
    setup() {
        this.send([
            this.createAction
        ]);
    }
    update() {
        const _this = this, dicts = _this.dicts, updateActions = _this.updateActions;
        if (!this._created) {
            this._created = true;
            updateActions.push(this.createdAction);
        }
        if (updateActions.length) {
            if (dicts.length) {
                updateActions.unshift([
                    0,
                    dicts
                ]);
            }
            this.send(updateActions);
        }
        this.clear();
    }
    clear() {
        this.dicts.length = 0;
        this.updateActions.length = 0;
        this._updating = false;
        this._createActionMap.clear();
    }
    send(action: (PageAction | DictAction)[]) {
        UniServiceJSBridge.publishHandler(VD_SYNC, action, this.pageId);
    }
    fireEvent(id: number, evt: UniEvent) {
        const node = findNodeById(id, this);
        if (node) {
            node.dispatchEvent(evt);
        }
    }
}
function addCurrentPage(page: ComponentPublicInstance) {
    const $page = page.$page;
    if (!$page.meta.isNVue) {
        return pages.push(page);
    }
    const index = pages.findIndex((p)=>p.$page.id === page.$page.id);
    if (index > -1) {
        pages.splice(index, 1, page);
    } else {
        pages.push(page);
    }
}
function setupPage(component: VuePageComponent) {
    const oldSetup = component.setup;
    component.inheritAttrs = false;
    component.setup = (_, ctx)=>{
        const _ctx_attrs = ctx.attrs, __pageId = _ctx_attrs.__pageId, __pagePath = _ctx_attrs.__pagePath, __pageQuery = _ctx_attrs.__pageQuery, __pageInstance = _ctx_attrs.__pageInstance;
        const instance = getCurrentInstance()!;
        const pageVm = instance.proxy!;
        initPageVm(pageVm, __pageInstance as Page.PageInstance['$page']);
        addCurrentPage(initScope(__pageId as number, pageVm, __pageInstance as Page.PageInstance['$page']));
        if (oldSetup) {
            return oldSetup(__pageQuery as Object, ctx);
        }
    };
    return component;
}
function getPageById(id: number) {
    return pages.find((page)=>page.$page.id === id);
}
function getAllPages() {
    return pages;
}
function getCurrentPages1() {
    const curPages: ComponentPublicInstance[] = [];
    pages.forEach((page)=>{
        if (page.$.__isTabBar) {
            if (page.$.__isActive) {
                curPages.push(page);
            }
        } else {
            curPages.push(page);
        }
    });
    return curPages;
}
let vueApp: VueApp;
function getVueApp() {
    return vueApp;
}
function removePage(curPage: ComponentPublicInstance | Page.PageInstance) {
    const index = pages.findIndex((page)=>page === curPage);
    if (index === -1) {
        return;
    }
    if (!curPage.$page.meta.isNVue) {
        getVueApp().unmountPage(curPage as ComponentPublicInstance);
    }
    pages.splice(index, 1);
}
function initVueApp(appVm: ComponentPublicInstance) {
    const internalInstance = appVm.$;
    Object.defineProperty((internalInstance as Object).ctx, '$children', {
        get () {
            return getAllPages().map((page)=>page.$vm);
        }
    } as UTSJSONObject);
    const appContext = internalInstance.appContext;
    vueApp = extend(appContext.app, {
        mountPage (pageComponent: VuePageComponent, pageProps: Record<string, Object>, pageContainer: UniNode) {
            const vnode = createVNode(pageComponent, pageProps);
            vnode.appContext = appContext;
            (vnode as Object).__page_container__ = pageContainer;
            render(vnode, pageContainer as Object as Element);
            const publicThis = vnode.component!.proxy!;
            (publicThis as Object).__page_container__ = pageContainer;
            return publicThis;
        },
        unmountPage: (pageInstance: ComponentPublicInstance)=>{
            const __page_container__ = pageInstance as Object.__page_container__;
            if (__page_container__) {
                __page_container__.isUnmounted = true;
                render(null, __page_container__);
            }
        }
    } as UTSJSONObject);
}
type VuePageAsyncComponent = () => Promise<VuePageComponent>;
function isVuePageAsyncComponent(component: Object): component is VuePageAsyncComponent {
    return isFunction(component);
}
const pagesMap = new Map<string, ReturnType<typeof createFactory>>();
function definePage(pagePath: string, asyncComponent: VuePageAsyncComponent | VuePageComponent) {
    pagesMap.set(pagePath, once(createFactory(asyncComponent)));
}
interface PageProps {
    __pageId: number;
    __pagePath: string;
    __pageQuery: Record<string, Object>;
    __pageInstance: Page.PageInstance['$page'];
}
function getPageNode(pageId: number): UniPageNode | null {
    const page = getPageById(pageId);
    if (!page) return null;
    return (page as Object).__page_container__ as UniPageNode;
}
function findNode(name: 'nodeId' | 'nodeName', value: string | number, uniNode: UniNode | number): UniNode | null {
    if (typeof uniNode === 'number') {
        uniNode = getPageNode(uniNode) as UniNode;
    }
    if (uniNode[name] === value) {
        return uniNode;
    }
    const childNodes = uniNode.childNodes;
    for(let i = 0; i < childNodes.length; i++){
        const uniNode = findNode(name, value, childNodes[i]);
        if (uniNode) {
            return uniNode;
        }
    }
    return null;
}
function findNodeById(nodeId: number, uniNode: UniNode | number) {
    return findNode('nodeId', nodeId, uniNode);
}
function findNodeByTagName(tagName: string, uniNode: UniNode | number): UniNode | null {
    return findNode('nodeName', tagName.toUpperCase(), uniNode);
}
function pushCreateAction(pageNode: UniPageNode, nodeId: number, nodeName: string | number) {
    pageNode.push([
        3,
        nodeId,
        pageNode.addDict(nodeName),
        -1,
        -1
    ]);
}
function pushInsertAction(pageNode: UniPageNode, newChild: UniBaseNode, parentNodeId: number, refChildId: number) {
    const nodeJson = newChild.toJSON({
        attr: true,
        normalize: pageNode.normalizeDict
    } as UTSJSONObject);
    pageNode.push([
        4,
        newChild.nodeId!,
        parentNodeId,
        refChildId
    ], Object.keys(nodeJson).length ? nodeJson : undefined);
}
function pushRemoveAction(pageNode: UniPageNode, nodeId: number) {
    pageNode.push([
        5,
        nodeId
    ]);
}
function pushAddEventAction(pageNode: UniPageNode, nodeId: number, name: string, value: number) {
    pageNode.push([
        8,
        nodeId,
        pageNode.addDict(name),
        value
    ]);
}
function pushAddWxsEventAction(pageNode: UniPageNode, nodeId: number, name: string, wxsEvent: string, value: number) {
    pageNode.push([
        12,
        nodeId,
        pageNode.addDict(name),
        pageNode.addDict(wxsEvent),
        value
    ]);
}
function pushRemoveEventAction(pageNode: UniPageNode, nodeId: number, name: string) {
    pageNode.push([
        9,
        nodeId,
        pageNode.addDict(name)
    ]);
}
function normalizeAttrValue(pageNode: UniPageNode, name: string, value: Object) {
    return name === 'style' && isPlainObject(value) ? pageNode.normalizeDict(value) : pageNode.addDict(value as Value);
}
function pushSetAttributeAction(pageNode: UniPageNode, nodeId: number, name: string, value: Object) {
    pageNode.push([
        6,
        nodeId,
        pageNode.addDict(name),
        normalizeAttrValue(pageNode, name, value)
    ]);
}
function pushRemoveAttributeAction(pageNode: UniPageNode, nodeId: number, name: string) {
    pageNode.push([
        7,
        nodeId,
        pageNode.addDict(name)
    ]);
}
function pushSetTextAction(pageNode: UniPageNode, nodeId: number, text: string) {
    pageNode.push([
        10,
        nodeId,
        pageNode.addDict(text)
    ]);
}
function createPageNode(pageId: number, pageOptions: PageNodeOptions, setup: boolean | null = null) {
    return new UniPageNode(pageId, pageOptions, setup);
}
function createVuePage(__pageId: number, __pagePath: string, __pageQuery: Record<string, Object>, __pageInstance: Page.PageInstance['$page'], pageOptions: PageNodeOptions) {
    const pageNode = createPageNode(__pageId, pageOptions, true);
    const app = getVueApp();
    const component = pagesMap.get(__pagePath)!();
    const mountPage = (component: VuePageComponent)=>app.mountPage(component, {
            __pageId,
            __pagePath,
            __pageQuery,
            __pageInstance
        } as UTSJSONObject, pageNode);
    if (isPromise(component)) {
        return component.then((component)=>mountPage(component));
    }
    return mountPage(component);
}
function createFactory(component: VuePageAsyncComponent | VuePageComponent) {
    return ()=>{
        if (isVuePageAsyncComponent(component)) {
            return component().then((component)=>setupPage(component));
        }
        return setupPage(component);
    };
}
function initScope(pageId: number, vm: ComponentPublicInstance, pageInstance: Page.PageInstance['$page']) {
    Object.defineProperty(vm, '$viewToTempFilePath', {
        get () {
            return vm.$nativePage!.viewToTempFilePath.bind(vm.$nativePage!);
        }
    } as UTSJSONObject);
    Object.defineProperty(vm, '$getPageStyle', {
        get () {
            return vm.$nativePage!.getPageStyle.bind(vm.$nativePage!);
        }
    } as UTSJSONObject);
    Object.defineProperty(vm, '$setPageStyle', {
        get () {
            return vm.$nativePage!.setPageStyle.bind(vm.$nativePage!);
        }
    } as UTSJSONObject);
    vm.getOpenerEventChannel = ()=>{
        if (!pageInstance.eventChannel) {
            pageInstance.eventChannel = new EventChannel(pageId);
        }
        return pageInstance.eventChannel as EventChannel;
    };
    return vm;
}
function initNVue(webviewStyle: PlusWebviewWebviewStyles, routeMeta: UniApp.PageRouteMeta, path: string) {
    if (path && routeMeta.isNVue) {
        (webviewStyle as Object).uniNView = {
            path,
            defaultFontSize: (__uniConfig as Object).defaultFontSize,
            viewport: (__uniConfig as Object).viewport
        };
    }
}
const colorRE = /^#[a-z0-9]{6}$/i;
function isColor(color: string | null = null) {
    return color && (colorRE.test(color) || color === 'transparent');
}
function initBackgroundColor(webviewStyle: PlusWebviewWebviewStyles, routeMeta: UniApp.PageRouteMeta) {
    let backgroundColor = routeMeta.backgroundColor;
    if (!backgroundColor) {
        return;
    }
    if (!isColor(backgroundColor)) {
        return;
    }
    if (!webviewStyle.background) {
        webviewStyle.background = backgroundColor;
    } else {
        backgroundColor = webviewStyle.background;
    }
    if (!webviewStyle.backgroundColorTop) {
        webviewStyle.backgroundColorTop = backgroundColor;
    }
    if (!webviewStyle.backgroundColorBottom) {
        webviewStyle.backgroundColorBottom = backgroundColor;
    }
    if (!webviewStyle.animationAlphaBGColor) {
        webviewStyle.animationAlphaBGColor = backgroundColor;
    }
    if (typeof webviewStyle.webviewBGTransparent === 'undefined') {
        webviewStyle.webviewBGTransparent = true;
    }
}
function initPopGesture(webviewStyle: PlusWebviewWebviewStyles, routeMeta: UniApp.PageRouteMeta) {
    if (webviewStyle.popGesture === 'hide') {
        delete webviewStyle.popGesture;
    }
    if (routeMeta.isQuit) {
        webviewStyle.popGesture = plus.os.name === 'iOS' ? 'appback' : 'none' as PlusWebviewWebviewStyles['popGesture'];
    }
}
function initPullToRefresh(webviewStyle: PlusWebviewWebviewStyles, routeMeta: UniApp.PageRouteMeta) {
    if (!routeMeta.enablePullDownRefresh) {
        return;
    }
    const pullToRefresh = normalizePullToRefreshRpx(extend({} as UTSJSONObject, plus.os.name === 'Android' ? defaultAndroidPullToRefresh : defaultPullToRefresh, routeMeta.pullToRefresh)) as Object as PlusWebviewWebviewPullToRefreshStyles;
    webviewStyle.pullToRefresh = initWebviewPullToRefreshI18n(pullToRefresh, routeMeta);
}
function initWebviewPullToRefreshI18n(pullToRefresh: PlusWebviewWebviewPullToRefreshStyles, routeMeta: UniApp.PageRouteMeta) {
    const i18nResult = initPullToRefreshI18n(pullToRefresh);
    if (!i18nResult) {
        return pullToRefresh;
    }
    const contentdownI18n = i18nResult[0], contentoverI18n = i18nResult[1], contentrefreshI18n = i18nResult[2];
    if (contentdownI18n || contentoverI18n || contentrefreshI18n) {
        .onLocaleChange(()=>{
            const webview = plus.webview.getWebviewById(routeMeta.id + '');
            if (!webview) {
                return;
            }
            const newPullToRefresh: PlusWebviewWebviewPullToRefreshStyles = {
                support: true
            };
            if (contentdownI18n) {
                newPullToRefresh.contentdown = {
                    caption: pullToRefresh.contentdown!.caption
                };
            }
            if (contentoverI18n) {
                newPullToRefresh.contentover = {
                    caption: pullToRefresh.contentover!.caption
                };
            }
            if (contentrefreshI18n) {
                newPullToRefresh.contentrefresh = {
                    caption: pullToRefresh.contentrefresh!.caption
                };
            }
            webview.setStyle({
                pullToRefresh: newPullToRefresh
            } as UTSJSONObject);
        });
    }
    return pullToRefresh;
}
const defaultAndroidPullToRefresh = {
    support: true,
    style: 'circle'
} as UTSJSONObject;
const defaultPullToRefresh = {
    support: true,
    style: 'default',
    height: '50px',
    range: '200px',
    contentdown: {
        caption: ''
    },
    contentover: {
        caption: ''
    },
    contentrefresh: {
        caption: ''
    }
} as UTSJSONObject;
function initTitleNView(webviewStyle: PlusWebviewWebviewStyles, routeMeta: UniApp.PageRouteMeta) {
    const navigationBar = routeMeta.navigationBar;
    if (navigationBar.style === 'custom') {
        return false;
    }
    let autoBackButton = true;
    if (routeMeta.isQuit) {
        autoBackButton = false;
    }
    const titleNView: PlusWebviewWebviewTitleNViewStyles = {
        autoBackButton
    };
    Object.keys(navigationBar).forEach((name)=>{
        const value = navigationBar[name as keyof UniApp.PageNavigationBar];
        if (name === 'titleImage' && value) {
            titleNView.tags = createTitleImageTags(value as string);
        } else if (name === 'buttons' && isArray(value)) {
            titleNView.buttons = (value as UniApp.PageNavigationBar['buttons'])!.map((button, index)=>{
                (button as Object).onclick = createTitleNViewBtnClick(index);
                return button;
            });
        } else {
            titleNView[name as keyof PlusWebviewWebviewTitleNViewStyles] = value as Object;
        }
    });
    webviewStyle.titleNView = initTitleNViewI18n(titleNView, routeMeta);
}
function initTitleNViewI18n(titleNView: PlusWebviewWebviewTitleNViewStyles, routeMeta: UniApp.PageRouteMeta) {
    const i18nResult = initNavigationBarI18n(titleNView);
    if (!i18nResult) {
        return titleNView;
    }
    const titleTextI18n = i18nResult[0], searchInputPlaceholderI18n = i18nResult[1];
    if (titleTextI18n || searchInputPlaceholderI18n) {
        .onLocaleChange(()=>{
            const webview = plus.webview.getWebviewById(routeMeta.id + '');
            if (!webview) {
                return;
            }
            const newTitleNView: PlusWebviewWebviewTitleNViewStyles = {};
            if (titleTextI18n) {
                newTitleNView.titleText = titleNView.titleText;
            }
            if (searchInputPlaceholderI18n) {
                newTitleNView.searchInput = {
                    placeholder: titleNView.searchInput!.placeholder
                };
            }
            webview.setStyle({
                titleNView: newTitleNView
            } as UTSJSONObject);
        });
    }
    return titleNView;
}
function createTitleImageTags(titleImage: string) {
    return [
        {
            tag: 'img' as 'img',
            src: titleImage,
            position: {
                left: 'auto',
                top: 'auto',
                width: 'auto',
                height: '26px'
            }
        }
    ];
}
function createTitleNViewBtnClick(index: number) {
    return (btn: UniApp.PageNavigationBarButton)=>{
        (btn as Object).index = index;
        invokeHook(ON_NAVIGATION_BAR_BUTTON_TAP, btn);
    };
}
let id = 1;
function getWebviewId() {
    return id;
}
function genWebviewId() {
    return id++;
}
function encode2(val: Parameters<typeof encodeURIComponent>[0]) {
    return val as string;
}
type InitUniPageUrl = ReturnType<typeof initUniPageUrl>;
type DebugRefresh = ReturnType<typeof initDebugRefresh>;
function initUniPageUrl(path: string, query: Record<string, Object>) {
    const queryString = query ? stringifyQuery(query, encode2) : '';
    return {
        path: path.slice(1),
        query: queryString ? queryString.slice(1) : queryString
    };
}
function initDebugRefresh(isTab: boolean, path: string, query: Record<string, Object>) {
    const queryString = query ? stringifyQuery(query, encode2) : '';
    return {
        isTab,
        arguments: JSON.stringify({
            path: path.slice(1),
            query: queryString ? queryString.slice(1) : queryString
        } as UTSJSONObject)
    };
}
function parseWebviewStyle(path: string, routeMeta: UniApp.PageRouteMeta, webview: {
    id: string;
}): PlusWebviewWebviewStyles & {
    uniPageUrl?: InitUniPageUrl;
    debugRefresh?: DebugRefresh;
    isTab?: boolean;
    locale?: string;
} {
    const webviewStyle: PlusWebviewWebviewStyles = {
        bounce: 'vertical'
    };
    Object.keys(routeMeta).forEach((name)=>{
        if (WEBVIEW_STYLE_BLACKLIST.indexOf(name) === -1) {
            webviewStyle[name as keyof PlusWebviewWebviewStyles] = routeMeta[name as keyof UniApp.PageRouteMeta];
        }
    });
    if (webview.id !== '1') {
        initNVue(webviewStyle, routeMeta, path);
    }
    initPopGesture(webviewStyle, routeMeta);
    initBackgroundColor(webviewStyle, routeMeta);
    initTitleNView(webviewStyle, routeMeta);
    initPullToRefresh(webviewStyle, routeMeta);
    return webviewStyle;
}
const WEBVIEW_STYLE_BLACKLIST = [
    'id',
    'route',
    'isNVue',
    'isQuit',
    'isEntry',
    'isTabBar',
    'tabBarIndex',
    'windowTop',
    'topWindow',
    'leftWindow',
    'rightWindow',
    'maxWidth',
    'usingComponents',
    'disableScroll',
    'enablePullDownRefresh',
    'navigationBar',
    'pullToRefresh',
    'onReachBottomDistance',
    'pageOrientation',
    'backgroundColor'
];
type SetStatusBarStyle = typeof plus.navigator.setStatusBarStyle;
type StatusBarStyle = Parameters<SetStatusBarStyle>[0];
let oldSetStatusBarStyle = plus.navigator.setStatusBarStyle;
function newSetStatusBarStyle(style: StatusBarStyle) {
    style;
    oldSetStatusBarStyle(style);
}
plus.navigator.setStatusBarStyle = newSetStatusBarStyle;
let preloadWebview: PlusWebviewWebviewObject & {
    loaded?: boolean;
    __uniapp_route?: string;
};
function setPreloadWebview(webview: PlusWebviewWebviewObject) {
    return preloadWebview = webview;
}
function getPreloadWebview() {
    return preloadWebview;
}
function createPreloadWebview() {
    if (!preloadWebview || (preloadWebview as Object).__uniapp_route) {
        preloadWebview = plus.webview.create(VIEW_WEBVIEW_PATH, String(genWebviewId()), {
            contentAdjust: false
        } as UTSJSONObject);
    }
    return preloadWebview;
}
function isDirectPage(page: Page.PageInstance) {
    return (__uniConfig.realEntryPagePath && page.$page.route === __uniConfig.entryPagePath);
}
function reLaunchEntryPage() {
    __uniConfig.entryPagePath = __uniConfig.realEntryPagePath;
    delete __uniConfig.realEntryPagePath;
    .reLaunch({
        url: addLeadingSlash(__uniConfig.entryPagePath!)
    } as ReLaunchOptions);
}
const EVENT_BACKBUTTON = 'backbutton';
function backbuttonListener() {
    .navigateBack({
        from: 'backbutton',
        success () {}
    } as UniApp.NavigateBackOptions);
}
const enterOptions: LaunchOptions = createLaunchOptions();
const launchOptions: LaunchOptions = createLaunchOptions();
function initLaunchOptions(ref1: Partial<RedirectInfo>) {
    let path = ref1.path, query = ref1.query, referrerInfo = ref1.referrerInfo;
    extend(launchOptions, {
        path,
        query: query ? parseQuery(query) : {},
        referrerInfo: referrerInfo || {},
        channel: undefined,
        launcher: undefined
    } as UTSJSONObject);
    extend(enterOptions, launchOptions);
    return extend({} as UTSJSONObject, launchOptions);
}
interface RedirectInfo extends Omit<LaunchOptions, 'query' | 'scene'> {
    query: string;
    userAction: boolean;
}
interface CreateWebviewOptions {
    path: string;
    query: Record<string, string>;
    routeOptions: UniApp.UniRoute;
    webviewExtras?: Record<string, Object>;
}
function onWebviewReady(pageId: string, callback: (...args: Object[]) => void) {
    UniServiceJSBridge.once(ON_WEBVIEW_READY + '.' + pageId, callback);
}
interface RouteOptions {
    url: string;
    path: string;
    query: Record<string, Object>;
}
function closeWebview(webview: PlusWebviewWebviewObject, animationType: string, animationDuration: number | null = null) {
    webview[(webview as Object).__preload__ ? 'hide' : 'close'](animationType as Object, animationDuration);
}
interface PendingNavigator {
    path: string;
    nvue?: boolean;
    callback: Function;
}
let pendingNavigator: PendingNavigator | false = false;
function getPendingNavigator() {
    return pendingNavigator;
}
function setPendingNavigator(path: string, callback: Function, msg: string) {
    pendingNavigator = {
        path,
        nvue: getRouteMeta(path)!.isNVue,
        callback
    };
}
function pendingNavigate() {
    if (!pendingNavigator) {
        return;
    }
    const callback = pendingNavigator.callback;
    pendingNavigator = false;
    return callback();
}
function navigateFinish() {
    if (__uniConfig.renderer === 'native') {
        if (!pendingNavigator) {
            return;
        }
        if (pendingNavigator.nvue) {
            return pendingNavigate();
        }
        return;
    }
    const preloadWebview = createPreloadWebview();
    if (!pendingNavigator) {
        return;
    }
    if (pendingNavigator.nvue) {
        return pendingNavigate();
    }
    preloadWebview.loaded ? pendingNavigator.callback() : onWebviewReady(preloadWebview.id!, pendingNavigate);
}
function showWebview(webview: PlusWebviewWebviewObject, animationType: string, animationDuration: number, showCallback: Function, delay: number | null = null) {
    if (typeof delay === 'undefined') {
        delay = (webview as Object).nvue ? 0 : 100;
    }
    const execShowCallback = ()=>{
        if (execShowCallback._called) {
            return;
        }
        execShowCallback._called = true;
        showCallback && showCallback();
        navigateFinish();
    };
    execShowCallback._called = false;
    setTimeout(()=>{
        const timer = setTimeout(()=>{
            execShowCallback();
        }, animationDuration + 150);
        webview.show(animationType as Object, animationDuration, ()=>{
            if (!execShowCallback._called) {
                clearTimeout(timer);
            }
            execShowCallback();
        });
    }, delay);
}
function backWebview(webview: PlusWebviewWebviewObject, callback: () => void) {
    const children = webview.children();
    if (!children || !children.length) {
        return callback();
    }
    const childWebview = children.find((webview)=>webview.id!.indexOf(WEBVIEW_ID_PREFIX) === 0) || children[0];
    childWebview.canBack((ref1)=>{
        let canBack = ref1.canBack;
        if (canBack) {
            childWebview.back();
        } else {
            callback();
        }
    });
}
function navigate(path: string, callback: () => void, isAppLaunch: boolean) {
    const pendingNavigator = getPendingNavigator();
    if (!isAppLaunch && pendingNavigator) {
        return console.error(`Waiting to navigate to: ${pendingNavigator.path}, do not operate continuously: ${path}.`);
    }
    const preloadWebview = getPreloadWebview();
    const waitPreloadWebview = !preloadWebview || (preloadWebview && preloadWebview.__uniapp_route);
    const waitPreloadWebviewReady = preloadWebview && !preloadWebview.loaded;
    if (waitPreloadWebview || waitPreloadWebviewReady) {
        setPendingNavigator(path, callback, waitPreloadWebview ? 'waitForCreate' : 'waitForReady');
    } else {
        callback();
    }
    if (waitPreloadWebviewReady) {
        onWebviewReady(preloadWebview.id!, pendingNavigate);
    }
}
function initRouteOptions(path: string, openType: UniApp.OpenType) {
    const routeOptions = JSON.parse(JSON.stringify(getRouteOptions(path)!)) as UniApp.UniRoute;
    routeOptions.meta = initRouteMeta(routeOptions.meta);
    if (openType !== 'preloadPage' && !__uniConfig.realEntryPagePath && (openType === 'reLaunch' || getCurrentPages().length === 0)) {
        routeOptions.meta.isQuit = true;
    } else if (!routeOptions.meta.isTabBar) {
        routeOptions.meta.isQuit = false;
    }
    return routeOptions;
}
interface RegisterPageOptions {
    url: string;
    path: string;
    query: Record<string, string>;
    openType: UniApp.OpenType;
    webview?: PlusWebviewWebviewObject;
    nvuePageVm?: ComponentPublicInstance;
    eventChannel?: EventChannel;
}
function initWebviewStyle(webview: PlusWebviewWebviewObject, path: string, query: Record<string, Object>, routeMeta: UniApp.PageRouteMeta) {
    const getWebviewStyle = ()=>parseWebviewStyle(path, routeMeta, webview);
    const webviewStyle = getWebviewStyle();
    webviewStyle.uniPageUrl = initUniPageUrl(path, query);
    const isTabBar = !!routeMeta.isTabBar;
    webviewStyle.debugRefresh = initDebugRefresh(isTabBar, path, query);
    webview.setStyle(webviewStyle);
}
function initWebview(webview: PlusWebviewWebviewObject, path: string, query: Record<string, Object>, routeMeta: UniApp.PageRouteMeta) {
    initWebviewStyle(webview, path, query, routeMeta);
}
function createWebview(options: CreateWebviewOptions) {
    if (getWebviewId() === 2) {
        return plus.webview.getLaunchWebview();
    }
    return getPreloadWebview();
}
function getStatusbarHeight() {
    return 0;
}
function registerPage(ref1: RegisterPageOptions) {
    let url = ref1.url, path = ref1.path, query = ref1.query, openType = ref1.openType, webview = ref1.webview, nvuePageVm = ref1.nvuePageVm, eventChannel = ref1.eventChannel;
    const routeOptions = initRouteOptions(path, openType);
    if (!webview) {
        webview = createWebview({
            path,
            routeOptions,
            query
        } as UTSJSONObject);
    } else {
        webview = plus.webview.getWebviewById(webview.id);
        (webview as Object).nvue = routeOptions.meta.isNVue;
    }
    routeOptions.meta.id = parseInt(webview.id!);
    initWebview(webview, path, query, routeOptions.meta);
    const route = path.slice(1);
    (webview as Object).__uniapp_route = route;
    const pageInstance = initPageInternalInstance(openType, url, query, routeOptions.meta, eventChannel, 'light');
    const id = parseInt(webview.id!);
    createVuePage(id, route, query, pageInstance, initPageOptions(routeOptions));
    return webview;
}
function initPageOptions(ref1: UniApp.UniRoute): PageNodeOptions {
    let meta = ref1.meta;
    const statusbarHeight = getStatusbarHeight();
    const _getBaseSystemInfo = getBaseSystemInfo(), platform = _getBaseSystemInfo.platform, pixelRatio = _getBaseSystemInfo.pixelRatio, windowWidth = _getBaseSystemInfo.windowWidth;
    return {
        css: true,
        route: meta.route,
        version: 1,
        locale: '',
        platform,
        pixelRatio,
        windowWidth,
        disableScroll: meta.disableScroll === true,
        onPageScroll: false,
        onPageReachBottom: false,
        onReachBottomDistance: hasOwn(meta, 'onReachBottomDistance') ? meta.onReachBottomDistance! : 50,
        statusbarHeight,
        windowTop: 0,
        windowBottom: 0
    };
}
interface NavigateToOptions extends RouteOptions {
    events: Record<string, Object>;
    aniType: string;
    aniDuration: number;
}
function initAnimation(path: string, animationType: string | null = null, animationDuration: number | null = null) {
    const globalStyle = __uniConfig.globalStyle;
    const meta = getRouteMeta(path)!;
    return [
        animationType || meta.animationType || globalStyle.animationType || ANI_SHOW,
        animationDuration || meta.animationDuration || globalStyle.animationDuration || 300
    ] as const;
}
const $navigateTo: DefineAsyncApiFn<API_TYPE_NAVIGATE_TO> = (args, ref1)=>{
    let resolve = ref1.resolve, reject = ref1.reject;
    const url = args.url, events = args.events, animationType = args.animationType, animationDuration = args.animationDuration;
    const _parseUrl = parseUrl(url), path = _parseUrl.path, query = _parseUrl.query;
    const _initAnimation = initAnimation(path, animationType, animationDuration), aniType = _initAnimation[0], aniDuration = _initAnimation[1];
    navigate(path, ()=>{
        _navigateTo({
            url,
            path,
            query,
            events,
            aniType,
            aniDuration
        } as UTSJSONObject).then(resolve).catch(reject);
    }, (args as Object).openType === 'appLaunch');
};
const navigateTo = defineAsyncApi(API_NAVIGATE_TO, $navigateTo, NavigateToProtocol, NavigateToOptions);
interface NavigateToOptions extends RouteOptions {
    events: Record<string, Object>;
    aniType: string;
    aniDuration: number;
}
function _navigateTo(ref1: NavigateToOptions): Promise<void | {
    eventChannel: EventChannel;
}> {
    let url = ref1.url, path = ref1.path, query = ref1.query, events = ref1.events, aniType = ref1.aniType, aniDuration = ref1.aniDuration;
    invokeHook(ON_HIDE);
    invokeHook(ON_HIDE);
    const eventChannel = new EventChannel(getWebviewId() + 1, events);
    return new Promise((resolve)=>{
        showWebview(registerPage({
            url,
            path,
            query,
            openType: 'navigateTo',
            eventChannel
        } as UTSJSONObject), aniType, aniDuration, ()=>{
            resolve({
                eventChannel
            } as UTSJSONObject);
        });
    });
}
const navigateBack = defineAsyncApi(API_NAVIGATE_BACK, (args, ref1)=>{
    let resolve = ref1.resolve, reject = ref1.reject;
    const page = getCurrentPage();
    if (!page) {
        return reject(`getCurrentPages is empty`);
    }
    if (invokeHook(page as ComponentPublicInstance, ON_BACK_PRESS, {
        from: (args as Object).from || 'navigateBack'
    } as UTSJSONObject)) {
        return resolve();
    }
    if (.hideToast) {
        .hideToast();
    }
    if (.hideLoading) {
        .hideLoading();
    }
    if (page.$page.meta.isQuit) {
        quit();
    } else if (isDirectPage(page)) {
        reLaunchEntryPage();
    } else {
        const _ref = args!, delta = _ref.delta, animationType = _ref.animationType, animationDuration = _ref.animationDuration;
        back(delta!, animationType, animationDuration);
    }
    return resolve();
}, NavigateBackProtocol, NavigateBackOptions);
let firstBackTime = 0;
function quit() {
    initI18nAppMsgsOnce();
    if (!firstBackTime) {
        firstBackTime = Date.now();
        plus.nativeUI.toast(useI18n().t('uni.app.quit'));
        setTimeout(()=>{
            firstBackTime = 0;
        }, 2000);
    } else if (Date.now() - firstBackTime < 2000) {
        plus.runtime.quit();
    }
}
function back(delta: number, animationType: string | null = null, animationDuration: number | null = null) {
    const pages = getCurrentPages();
    const len = pages.length;
    const currentPage = pages[len - 1];
    if (delta > 1) {
        pages.slice(len - delta, len - 1).reverse().forEach((deltaPage)=>{
            closeWebview(plus.webview.getWebviewById(deltaPage.$page.id + ''), 'none', 0);
        });
    }
    const backPage = (webview: PlusWebviewWebviewObject)=>{
        if (animationType) {
            closeWebview(webview, animationType, animationDuration || 300);
        } else {
            if (currentPage.$page.openType === 'redirectTo') {
                closeWebview(webview, ANI_CLOSE, 300);
            } else {
                closeWebview(webview, 'auto');
            }
        }
        pages.slice(len - delta, len).forEach((page)=>removePage(page as ComponentPublicInstance));
        invokeHook(ON_SHOW);
    };
    const webview = plus.webview.getWebviewById(currentPage.$page.id + '');
    if (!(currentPage as Object).__uniapp_webview) {
        return backPage(webview);
    }
    backWebview(webview, ()=>{
        backPage(webview);
    });
}
const mod = {
    navigateTo: navigateTo,
    navigateBack: navigateBack,
    chooseImage,
    chooseVideo,
    getImageInfo,
    getVideoInfo,
    request,
    uploadFile,
    downloadFile,
    getLocale,
    getSystemInfoSync
} as UTSJSONObject;
const UniServiceJSBridge1 = extend(ServiceJSBridge, {
    publishHandler
} as UTSJSONObject);
function publishHandler(event: string, args: Object, pageIds: number | number[]) {
    args = JSON.stringify(args);
    if (!isArray(pageIds)) {
        pageIds = [
            pageIds
        ];
    }
    const evalJSCode = `typeof UniViewJSBridge !== 'undefined' && UniViewJSBridge.subscribeHandler("${event}",${args},__PAGE_ID__)`;
    pageIds.forEach((id)=>{
        const idStr = String(id);
        const webview = plus.webview.getWebviewById(idStr);
        const code = evalJSCode.replace('__PAGE_ID__', idStr);
        webview && webview.evalJS(code);
    });
}
let focusTimeout = 0;
let keyboardHeight = 0;
let focusTimer: ReturnType<typeof setTimeout> | null = null;
function hookKeyboardEvent(event: UniEvent, callback: (event: UniEvent) => void) {
    null;
    if (focusTimer) {
        clearTimeout(focusTimer);
        focusTimer = null;
    }
    if (event.type === 'onFocus') {
        if (keyboardHeight > 0) {
            event.detail!.height = keyboardHeight;
        } else {
            focusTimer = setTimeout(()=>{
                event.detail!.height = keyboardHeight;
                callback(event);
            }, focusTimeout);
            (()=>{
                if (focusTimer) {
                    clearTimeout(focusTimer);
                    focusTimer = null;
                }
                event.detail!.height = keyboardHeight;
                callback(event);
            });
            return;
        }
    }
    callback(event);
}
type EventAction = [typeof ACTION_TYPE_EVENT, Parameters<typeof onNodeEvent>[0], Parameters<typeof onNodeEvent>[1]];
function onNodeEvent(nodeId: number, evt: UniEvent, pageNode: UniPageNode) {
    const type = evt.type;
    if (type === 'onFocus' || type === 'onBlur') {
        hookKeyboardEvent(evt, (evt)=>{
            pageNode.fireEvent(nodeId, evt);
        });
    } else {
        pageNode.fireEvent(nodeId, evt);
    }
}
function onVdSync(actions: EventAction[], pageId: string) {
    const page = getPageById(parseInt(pageId));
    if (!page) {
        return;
    }
    const pageNode = (page as Object).__page_container__ as UniPageNode;
    actions.forEach((action)=>{
        switch(action[0]){
            case 20:
                onNodeEvent(action[1], action[2], pageNode);
                break;
        }
    });
}
function subscribePlusMessage(ref1: {
    data: {
        type: string;
        args: Record<string, Object>;
    };
}) {
    let data = ref1.data;
    if (data && data.type) {
        UniServiceJSBridge.subscribeHandler('plusMessage.' + data.type, data.args);
    }
}
function onPlusMessage<T>(type: string, callback: (args: T) => void, once: boolean = false) {
    UniServiceJSBridge.subscribe('plusMessage.' + type, callback, once);
}
const API_ROUTE = [
    'switchTab',
    'reLaunch',
    'redirectTo',
    'navigateTo',
    'navigateBack'
] as const;
function subscribeNavigator() {
    API_ROUTE.forEach((name)=>{
        registerServiceMethod(name, (args)=>{
            (uni[name] as (options: Object) => void)(extend(args, {
                fail (res: {
                    errMsg: string;
                }) {
                    console.error(res.errMsg);
                }
            } as UTSJSONObject));
        });
    });
}
const $switchTab: DefineAsyncApiFn<API_TYPE_SWITCH_TAB> = (args, ref1)=>{
    let resolve = ref1.resolve, reject = ref1.reject;
    throw new Error('API $switchTab is not yet implemented');
};
let isLaunchWebviewReady = false;
function subscribeWebviewReady(_data: Object, pageId: string) {
    const isLaunchWebview = pageId === '1';
    if (isLaunchWebview && isLaunchWebviewReady) {
        return;
    }
    let preloadWebview = getPreloadWebview();
    if (isLaunchWebview) {
        isLaunchWebviewReady = true;
        preloadWebview = setPreloadWebview(plus.webview.getLaunchWebview());
    } else if (!preloadWebview) {
        preloadWebview = setPreloadWebview(plus.webview.getWebviewById(pageId));
    }
    if (!preloadWebview.loaded) {
        if (preloadWebview.id !== pageId) {
            return console.error(`webviewReady[${preloadWebview.id}][${pageId}] not match`);
        }
        (preloadWebview as Object).loaded = true;
    }
    UniServiceJSBridge.emit(ON_WEBVIEW_READY + '.' + pageId);
    isLaunchWebview && onLaunchWebviewReady();
}
function onLaunchWebviewReady() {
    const entryPagePath = addLeadingSlash(__uniConfig.entryPagePath!);
    const routeOptions = getRouteOptions(entryPagePath)!;
    const args = {
        url: entryPagePath + (__uniConfig.entryPageQuery || ''),
        openType: 'appLaunch'
    } as UTSJSONObject;
    const handler = {
        resolve () {},
        reject () {}
    } as UTSJSONObject;
    if (routeOptions.meta.isTabBar) {
        return $switchTab(args, handler);
    }
    return $navigateTo(args, handler);
}
function onWebviewInserted(_: Object, pageId: string) {
    const page = getPageById(parseInt(pageId));
    page && ((page as Object).__uniapp_webview = true);
}
function onWebviewRemoved(_: Object, pageId: string) {
    const page = getPageById(parseInt(pageId));
    page && delete (page as Object).__uniapp_webview;
}
type Name = 'navigateTo' | 'navigateBack' | 'switchTab' | 'reLaunch' | 'redirectTo' | 'postMessage';
class WebInvokeData extends UTSObject {
    name!: Name;
    arg!: Object;
}
type WebInvokeAppService = (webInvokeData: WebInvokeData, pageIds: string[]) => void;
const onWebInvokeAppService: WebInvokeAppService = (ref1, pageIds)=>{
    let name = ref1.name, arg = ref1.arg;
    if (name === 'postMessage') {
        onMessage(pageIds[0], arg);
    } else {
        (uni[name] as (options: Object) => void)(extend(arg, {
            fail (res: {
                errMsg: string;
            }) {
                console.error(res.errMsg);
            }
        } as UTSJSONObject));
    }
};
function onMessage(pageId: string, arg: Object) {
    const uniNode = findNodeByTagName('web-view', parseInt(pageId));
    uniNode && uniNode.dispatchEvent(createUniEvent({
        type: 'onMessage',
        target: Object.create(null),
        currentTarget: Object.create(null),
        detail: {
            data: [
                arg
            ]
        }
    } as UTSJSONObject));
}
function initSubscribeHandlers() {
    const subscribe = UniServiceJSBridge.subscribe, subscribeHandler = UniServiceJSBridge.subscribeHandler, publishHandler = UniServiceJSBridge.publishHandler;
    onPlusMessage('subscribeHandler', (ref1)=>{
        let type = ref1.type, data = ref1.data, pageId = ref1.pageId;
        subscribeHandler(type, data, pageId);
    });
    onPlusMessage(WEB_INVOKE_APPSERVICE, (ref1)=>{
        let data = ref1.data, webviewIds = ref1.webviewIds;
        onWebInvokeAppService(data, webviewIds);
    });
    subscribe(ON_WEBVIEW_READY, subscribeWebviewReady);
    subscribe(VD_SYNC, onVdSync);
    subscribeServiceMethod();
    subscribeNavigator();
    subscribe(WEBVIEW_INSERTED, onWebviewInserted);
    subscribe(WEBVIEW_REMOVED, onWebviewRemoved);
    const routeOptions = getRouteOptions(addLeadingSlash(__uniConfig.entryPagePath!));
    if (routeOptions) {
        publishHandler(ON_WEBVIEW_READY, {} as UTSJSONObject, 1);
    }
}
function initGlobalEvent() {
    const plusGlobalEvent = (plus as Object).globalEvent;
    plus.key.addEventListener(EVENT_BACKBUTTON, backbuttonListener);
    plusGlobalEvent.addEventListener('plusMessage', subscribePlusMessage);
}
function initAppLaunch(appVm: ComponentPublicInstance) {
    injectAppHooks(appVm.$);
    const entryPagePath = __uniConfig.entryPagePath, entryPageQuery = __uniConfig.entryPageQuery, referrerInfo = __uniConfig.referrerInfo;
    const args = initLaunchOptions({
        path: entryPagePath,
        query: entryPageQuery,
        referrerInfo: referrerInfo
    } as UTSJSONObject);
    invokeHook(appVm, ON_LAUNCH, args);
    invokeHook(appVm, ON_SHOW, args);
}
let appCtx: ComponentPublicInstance;
const defaultApp = {
    globalData: {}
} as UTSJSONObject;
function getApp1({ allowDefault =false  } = {}) {
    if (appCtx) {
        return appCtx;
    }
    if (allowDefault) {
        return defaultApp;
    }
    console.error('[warn]: getApp() failed. Learn more: https://uniapp.dcloud.io/collocation/frame/window?id=getapp.');
}
function registerApp(appVm: ComponentPublicInstance) {
    initVueApp(appVm);
    appCtx = appVm;
    initAppVm(appCtx);
    extend(appCtx, defaultApp);
    defineGlobalData(appCtx, defaultApp.globalData);
    initService();
    initGlobalEvent();
    initSubscribeHandlers();
    initAppLaunch(appVm);
    __uniConfig.ready = true;
}
const default = {
    uni: mod,
    getApp: getApp1,
    getCurrentPages: getCurrentPages1,
    __definePage: definePage,
    __registerApp: registerApp,
    UniServiceJSBridge: UniServiceJSBridge1
} as UTSJSONObject;
export { default as default,  };
'use strict';
function tryCatch(fn: Function): Function {
    return ()=>{
        try {
            return fn.apply(fn, arguments);
        } catch (e) {
            console.error(e);
        }
    };
}
let invokeCallbackId = 1;
const invokeCallbacks: {
    [id: string]: {
        name: string;
        keepAlive: boolean;
        callback: Function;
    };
} = {};
function addInvokeCallback(id: number, name: string, callback: Function, keepAlive: boolean = false) {
    invokeCallbacks[id] = {
        name,
        keepAlive,
        callback
    };
    return id;
}
function invokeCallback(id: number, res: Object, extras: Object | null = null) {
    if (typeof id === 'number') {
        const opts = invokeCallbacks[id];
        if (opts) {
            if (!opts.keepAlive) {
                delete invokeCallbacks[id];
            }
            return opts.callback(res, extras);
        }
    }
    return res;
}
const API_SUCCESS = 'success';
const API_FAIL = 'fail';
const API_COMPLETE = 'complete';
type CALLBACK_TYPES = typeof API_SUCCESS | typeof API_FAIL | typeof API_COMPLETE;
type ApiCallbacks = {
    [key in CALLBACK_TYPES]?: Function;
};
function getApiCallbacks(args: Record<string, Object>) {
    const apiCallbacks: ApiCallbacks = {};
    for(const name in args){
        const fn = args[name];
        if (isFunction(fn)) {
            apiCallbacks[name as CALLBACK_TYPES] = tryCatch(fn);
            delete args[name];
        }
    }
    return apiCallbacks;
}
interface ApiRes {
    errMsg: string;
}
function normalizeErrMsg(errMsg: string, name: string) {
    if (!errMsg || errMsg.indexOf(':fail') === -1) {
        return name + ':ok';
    }
    return name + errMsg.substring(errMsg.indexOf(':fail'));
}
function createAsyncApiCallback(name: string, args: Record<string, Object> = {}, { beforeAll , beforeSuccess  }: ApiOptions<Object> = {}) {
    if (!isPlainObject(args)) {
        args = {};
    }
    const _getApiCallbacks = getApiCallbacks(args), success = _getApiCallbacks.success, fail = _getApiCallbacks.fail, complete = _getApiCallbacks.complete;
    const hasSuccess = isFunction(success);
    const hasFail = isFunction(fail);
    const hasComplete = isFunction(complete);
    const callbackId = invokeCallbackId++;
    addInvokeCallback(callbackId, name, (res: ApiRes)=>{
        res = res || {};
        res.errMsg = normalizeErrMsg(res.errMsg, name);
        isFunction(beforeAll) && beforeAll(res);
        if (res.errMsg === name + ':ok') {
            isFunction(beforeSuccess) && beforeSuccess(res, args);
            hasSuccess && success(res);
        } else {
            hasFail && fail(res);
        }
        hasComplete && complete(res);
    });
    return callbackId;
}
function encodeQueryString(url: string) {
    if (!isString(url)) {
        return url;
    }
    const index = url.indexOf('?');
    if (index === -1) {
        return url;
    }
    const query = url.slice(index + 1).trim().replace(/^(\?|#|&)/, '');
    if (!query) {
        return url;
    }
    url = url.slice(0, index);
    const params: string[] = [];
    query.split('&').forEach((param)=>{
        const parts = param.replace(/\+/g, ' ').split('=');
        const key = parts.shift();
        const val = parts.length > 0 ? parts.join('=') : '';
        params.push(key + '=' + encodeURIComponent(val));
    });
    return params.length ? url + '?' + params.join('&') : url;
}
