try {
            function sendLinkDefault() {
                Kakao.init('3ced68a536df0029f0b788bc4129c883')
                Kakao.Link.sendDefault({
                    objectType: 'feed',
                    content: {
                        title: '오늘 이거 먹어',
                        description: '#케익 #딸기 #디저트',
                        imageUrl: 'http://k.kakaocdn.net/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
                        link: {
                            mobileWebUrl: 'https://developers.kakao.com',
                            webUrl: 'https://developers.kakao.com',
                        },
                    },
                    social: {
                        likeCount: 2899,
                        commentCount: 245,
                        sharedCount: 845,
                    },
                    buttons: [{
                        title: '웹으로 보기',
                        link: {
                            mobileWebUrl: 'https://developers.kakao.com',
                            webUrl: 'https://developers.kakao.com',
                        },
                    }, ],
                })
            };
            window.kakaoDemoCallback && window.kakaoDemoCallback()
        } catch (e) {
            window.kakaoDemoException && window.kakaoDemoException(e)
        }