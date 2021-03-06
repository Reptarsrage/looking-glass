# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.4](https://github.com/reptarsrage/looking-glass/compare/v0.0.3...v0.0.4) (2020-11-09)

### Features

- adding ability to toggle caption on and off ([88c8c1a](https://github.com/reptarsrage/looking-glass/commit/88c8c1af0f7b1d2d86401e3345701f1c336112c3))
- adding support for local directories in file explorer ([f3f8bd1](https://github.com/reptarsrage/looking-glass/commit/f3f8bd1ea034bb55597fbe460f386dc55d0b5633))
- adding virtualized, grouped filters ([0c851a8](https://github.com/reptarsrage/looking-glass/commit/0c851a83ce167ffb8fb0113e7b8623cc475fb839))
- switching to @reach/router for navigation ([b3c2e41](https://github.com/reptarsrage/looking-glass/commit/b3c2e4115ee14042448a7981a52e0538d047f2bc))

### Bug Fixes

- fix drawer overlap with title bar ([12a97ac](https://github.com/reptarsrage/looking-glass/commit/12a97ac4714998604c8925016d49859f5340b4b1))
- fixing breaking change with useEffect in React 17 ([92e2431](https://github.com/reptarsrage/looking-glass/commit/92e243154685a819fc38709a13582990b9be611d))
- fixing bug with missing auth galleryID ([c9ade66](https://github.com/reptarsrage/looking-glass/commit/c9ade669fb7a77374966744d1bc1b0b6a44e67b6))
- fixing bugs with the new filter section stuff ([c88048f](https://github.com/reptarsrage/looking-glass/commit/c88048fb39b27d72dea63ffd2c7d0f912c74f61b))
- fixing electron store persist ([8ce9a8c](https://github.com/reptarsrage/looking-glass/commit/8ce9a8c679980619a5757ab8a9d8dd60ff54eb44))
- fixing issue with switching between themes ([9965958](https://github.com/reptarsrage/looking-glass/commit/9965958c6e6b109c34f83258f7f958db49fda932))
- fixing issues with artifactory urls showing up in yarn lockfile ([34480ca](https://github.com/reptarsrage/looking-glass/commit/34480ca0c7da54af117c9ffcd95e5be2999f5c4f))
- fixing scripts path typo ([79d515a](https://github.com/reptarsrage/looking-glass/commit/79d515a635f3bf80b181a97ea6adc70c1efac404))
- fixing two small typos ([fabd9d1](https://github.com/reptarsrage/looking-glass/commit/fabd9d1dcc114a40381f5b4b4e8ef699d2169a77))
- fixing whoopsie with default theme ([4df6446](https://github.com/reptarsrage/looking-glass/commit/4df64469066f2d27d28d7cf542df716832743166))
- initial item scale when modal first opens ([5930d81](https://github.com/reptarsrage/looking-glass/commit/5930d81d1ff431fb598ec6ffa4e11041fb46c783))
- modal close animation ([9876703](https://github.com/reptarsrage/looking-glass/commit/9876703f69e9872966868dee34768fb269c5d203))
- reverting bvack to react-router since reach router doesn't play well with electron ([f7b7e68](https://github.com/reptarsrage/looking-glass/commit/f7b7e68bdf6a50988b2c97e53fcb553200b25330))

### [0.0.3](https://github.com/reptarsrage/looking-glass/compare/v0.0.1...v0.0.3) (2020-09-30)

### Features

- addding new auth type "implicit" ([3f32a73](https://github.com/reptarsrage/looking-glass/commit/3f32a73256667cc9eb2d03c5e8b582d24e60b37f))
- adding ability to see reddit crossposts as filters ([2ff237f](https://github.com/reptarsrage/looking-glass/commit/2ff237f6906c4280629d8c5d05a1b6704e7cdb83))
- adding axios progress bar indicator ([dd86b22](https://github.com/reptarsrage/looking-glass/commit/dd86b228ca8e60de67b4c933c43be212ed42bd23))
- adding context menu items for text ([b285031](https://github.com/reptarsrage/looking-glass/commit/b285031db34615729a9d3220de20bc1d908b3b65))
- adding custom title bar ([9182edb](https://github.com/reptarsrage/looking-glass/commit/9182edbaeb0d3c6b5c988ad569085efc73a72ec8))
- adding end of scroll toast ([8d0650b](https://github.com/reptarsrage/looking-glass/commit/8d0650b7a86e937ba06a1e367f9b351062c503ba))
- adding full screen caption ([a042f17](https://github.com/reptarsrage/looking-glass/commit/a042f17921a57b6799cf66682f76de20a28ee24d))
- adding image with zoom ([60889c8](https://github.com/reptarsrage/looking-glass/commit/60889c888dbc0ab3ed0d0fa2eccd22e59ab4e10e))
- adding indicators for currently selected sort ([d233351](https://github.com/reptarsrage/looking-glass/commit/d233351bd471243a6f26cc4de3e4fa3c620ea597))
- adding item filters ([1346bc9](https://github.com/reptarsrage/looking-glass/commit/1346bc9c97d470d7d9000d440aa20069ea257232))
- adding item level filter sections ([a764ab0](https://github.com/reptarsrage/looking-glass/commit/a764ab064421eebd7b830f1f8d4d98bc15387135))
- adding modal header text ([2c5e114](https://github.com/reptarsrage/looking-glass/commit/2c5e1140e630677b4f8cd1e74af8d4e4b7a3629b))
- adding search for filtering filters ([bb4787e](https://github.com/reptarsrage/looking-glass/commit/bb4787ea8f58835d0955411ea39d1453a91baaa7))
- allowing image zoom to show image outside of original bounds ([61ba851](https://github.com/reptarsrage/looking-glass/commit/61ba851f8c378923d6a353cab86fa6b082f09f5b))
- fixing scroll restoration when navigating ([0c3f0d2](https://github.com/reptarsrage/looking-glass/commit/0c3f0d23332d2bd33c109c43d45513b78addf5b0))
- keeping track of masonry scroll duing full screen nav ([da325df](https://github.com/reptarsrage/looking-glass/commit/da325dfe00d95554b9c9a4a32fde2e73adb95df1))
- maintining relative scroll position on resize ([58bb9b2](https://github.com/reptarsrage/looking-glass/commit/58bb9b2b881310e09fcfd2cf0ef0e047fc1ae5f1))
- using a random available port instead of hardcoding local web server ([c385db5](https://github.com/reptarsrage/looking-glass/commit/c385db55ccf7e09f063b8aad50e3303f2997488d))

### Bug Fixes

- adding back in full screen item transitions ([4a7615c](https://github.com/reptarsrage/looking-glass/commit/4a7615cd04c0b83282b59a02046db05ded90bdf9))
- adjusting infinite scroll threshhold ([f00c0b1](https://github.com/reptarsrage/looking-glass/commit/f00c0b190fbb17131c4ac5b109d044238c5e9a93))
- adjusting progress tracker estimates ([61af026](https://github.com/reptarsrage/looking-glass/commit/61af026642589efae083b620279f96b754bd81c2))
- allowing gallery fetches even if error was encountered ([53ec5c1](https://github.com/reptarsrage/looking-glass/commit/53ec5c1a495657a40a392b99ad5247a4e61f03dc))
- disabling item filters for most modules ([8fbf483](https://github.com/reptarsrage/looking-glass/commit/8fbf483989a046162197bd65c6cbf07729a7ff6f))
- duplicate items in reducer ([13efcbb](https://github.com/reptarsrage/looking-glass/commit/13efcbb08c9f8cd0fa5bd5ec72ba0b94728c112b))
- fixing caption background overlap with button ([c333e2f](https://github.com/reptarsrage/looking-glass/commit/c333e2ffe85c3c6a17f6d127f085cc381c11d96c))
- fixing deploy ([c608be7](https://github.com/reptarsrage/looking-glass/commit/c608be7dee628a7fe8865aa8f5976cbcabc870a0))
- fixing devtools install ([a17fe5e](https://github.com/reptarsrage/looking-glass/commit/a17fe5ea13bce45e11ace9bc071dc1a8170b5981))
- fixing filter duplicates ([eae06f2](https://github.com/reptarsrage/looking-glass/commit/eae06f2bcb11f5b827d9709bcecd0a36527d7a8a))
- fixing full screen item next/prev ([59bddd7](https://github.com/reptarsrage/looking-glass/commit/59bddd7ea9f5eac7a143a019ad072f951f796740))
- fixing gallery drilldown ([41ed150](https://github.com/reptarsrage/looking-glass/commit/41ed150333414f2aae74b500be27d2402c69e717))
- fixing gutters in masonry and centering of items ([449eb8d](https://github.com/reptarsrage/looking-glass/commit/449eb8d2de22999db7aff75b93489706a8f2ad89))
- fixing HMR for now until Fast Refresh is a thing ([eb2958e](https://github.com/reptarsrage/looking-glass/commit/eb2958e5a8685468f369fcdcd096dbbdb7809368))
- fixing home scroll ([f3d7fae](https://github.com/reptarsrage/looking-glass/commit/f3d7fae4dd1786535fe1a7f25bed6d12b1a73e62))
- fixing image download links ([f302381](https://github.com/reptarsrage/looking-glass/commit/f302381c80dfd20abe9ab2f44cc83242b895596e))
- fixing loading indicator consistency ([f705931](https://github.com/reptarsrage/looking-glass/commit/f705931d8e15a3ca160ee0eafd0cb0bb5acb34aa))
- fixing module filter feature selector ([d10a7ed](https://github.com/reptarsrage/looking-glass/commit/d10a7ed8ba0b8ab73e90817aa1feb73242571e1f))
- fixing progress bar estimation ([11d3ecf](https://github.com/reptarsrage/looking-glass/commit/11d3ecfe96d459887eac364f7629a79f8b13bac9))
- fixing release directories to work with start ([28c7a7f](https://github.com/reptarsrage/looking-glass/commit/28c7a7f33abfc5fcd8fd991d7e0d9846f7da2946))
- fixing scroll bar affecting item positioning after load ([5728eea](https://github.com/reptarsrage/looking-glass/commit/5728eea06ab72ac1a6186b09654149f365752e31))
- fixing unecessary deep copies when calculating masonry columns ([a8d8b36](https://github.com/reptarsrage/looking-glass/commit/a8d8b367ae294eab2761e597f0948f0012712185))
- fixing unecessary log ([a028391](https://github.com/reptarsrage/looking-glass/commit/a0283912f0c0d4ea4a8c770b8f5e0275a38dccfb))
- fixing video playback when going full screen ([3dcbccd](https://github.com/reptarsrage/looking-glass/commit/3dcbccda515c8a93bc5fbb1bf2e861e835fc04f4))
- fixing wonky context menu options ([3f30613](https://github.com/reptarsrage/looking-glass/commit/3f3061316db7c3f04863012c054eff8e50506163))
- fizing z-index and overlapping app bar ([87fb4cd](https://github.com/reptarsrage/looking-glass/commit/87fb4cd2f1d84dbe0dd657144a4aefcd20fa19eb))
- hMR caused infinite transition updates with mui boxes ([046c6fe](https://github.com/reptarsrage/looking-glass/commit/046c6febf83985ddd648f624f304699b83a7964c))
- hot module replacement preserves redux store ([de0e839](https://github.com/reptarsrage/looking-glass/commit/de0e839ed0a0d90e3faa02e04b612e09ba9f67df))
- installing via nsis over msi ([6986878](https://github.com/reptarsrage/looking-glass/commit/6986878eb47905ec84318ad356b4d4c3511fbf7f))
- muting video when animating ([d915799](https://github.com/reptarsrage/looking-glass/commit/d9157999f89934c7c4667846f61552fec4e09395))
- removing error boundary router depdendency ([4479668](https://github.com/reptarsrage/looking-glass/commit/44796684e907dddc3cfab676a27b98a87c11f1a7))
- removing log ([203997e](https://github.com/reptarsrage/looking-glass/commit/203997ecd9381dfc6cd7063bd4fc224e8328c24e))
- removing unnuused sort text selector ([68a72ab](https://github.com/reptarsrage/looking-glass/commit/68a72abec10ff14dde0fb7a51cbf6589d122ed03))
- slide show video no longer muted ([dbc147a](https://github.com/reptarsrage/looking-glass/commit/dbc147a1ece422cad76674b52b1c4c7a0967b8fb))
- speeding up filesystem browsing using parrallelism ([2304429](https://github.com/reptarsrage/looking-glass/commit/23044292f93c23558b9cb91a8a31c0913eff2c44))
- video now supports motion ([82ce9a4](https://github.com/reptarsrage/looking-glass/commit/82ce9a42ab51bc553c9df4e04c54cd98444c6a93))
- virtualizedMasonry wasn't updating correctly ([a5e2cb0](https://github.com/reptarsrage/looking-glass/commit/a5e2cb03e190f43b68fecd4814b5401d451893e4))
- whoopsie committed a thing I shouldn't have ([f1900dd](https://github.com/reptarsrage/looking-glass/commit/f1900dd3e875581b1b1e23633c89b1a52718f5f7))

### [0.0.2](https://github.com/reptarsrage/looking-glass/compare/v0.0.1...v0.0.2) (2020-05-09)
