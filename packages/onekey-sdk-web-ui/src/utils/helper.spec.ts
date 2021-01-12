import {
  getCssColor,
  getDoctorCardOffset,
  selectSDKElement,
  getContainerHeightWidthOffset,
  applyDefaultTheme,
  getSpecialtiesText,
  getTextBodyToShare,
  fallbackShareHCPDetail,
  getBreakpointFromParentClientRect,
  getMergeMainAndOtherActivities
} from './helper';

afterEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('getTextBodyToShare', () => {
  const indiviualDetail = {
    fax: '780 4615442',
    name: 'Michael',
    address: '205-3017 66 St NW',
    phone: '780 4616012',
  }

  test('should return mail body with the new line character correctly', () => {
    const text = getTextBodyToShare(indiviualDetail)
    expect(text).toBe(`Name: Michael%0D%0AFax: 780 4615442%0D%0APhone: 780 4616012%0D%0AAddress: 205-3017 66 St NW`)
  })

  test('should return text with a custom new line character', () => {
    const text = getTextBodyToShare(indiviualDetail, '\n')
    expect(text).toBe(`Name: Michael\nFax: 780 4615442\nPhone: 780 4616012\nAddress: 205-3017 66 St NW`)
  })

});

describe('getMergeMainAndOtherActivities', () => {
  const mainActivity: any = {
    id: 'WCAM00000487'
  }
  const otherActivities: any = [
    {
      id: 'WCAM00000489'
    }
  ]
  test('should return an empty array with wrong args', () => {
    const results = getMergeMainAndOtherActivities(undefined, undefined);
    expect(results).toEqual([]);
  })
  test('should return mainActivity inside an array if otherActivities not exist', () => {
    const results = getMergeMainAndOtherActivities(mainActivity)
    expect(results).toEqual([mainActivity])
  })
  test('should merge mainActivity and otherActivities into an array', () => {
    const results = getMergeMainAndOtherActivities(mainActivity, otherActivities);
    expect(results).toEqual([mainActivity, otherActivities[0]])
  })
})

describe('fallbackShareHCPDetail', () => {
  const indiviualDetail = {
    fax: '780 4615442',
    name: 'Michael',
    address: '205-3017 66 St NW',
    phone: '780 4616012',
  }
  test('not throw an error', () => {
    expect(fallbackShareHCPDetail(indiviualDetail)).not.toThrowError
  })
})

describe('getBreakpointFromParentClientRect', () => {
  test('should detect the mobile by viewport', () => {
    const viewportMobilePortrait: any = {
      width: 375,
      height: 667
    }
    const viewportMobileLandscape: any = {
      width: 667,
      height: 375,
    }
    const objDevice_1 = getBreakpointFromParentClientRect(viewportMobileLandscape);
    const objDevice_2 = getBreakpointFromParentClientRect(viewportMobilePortrait);
    expect(objDevice_1).toEqual({ screenSize: 'mobile', orientation: 'landscape' })
    expect(objDevice_2).toEqual({ screenSize: 'mobile', orientation: 'portrait' })
  })

  test('should detect the tablet by viewport', () => {
    const viewportTablet: any = {
      width: 1024,
      height: 768,
    }
    const viewportTabletPortrait: any = {
      width: 768,
      height: 1024,
    }
    const objDevice = getBreakpointFromParentClientRect(viewportTablet);
    const objDevice_2 = getBreakpointFromParentClientRect(viewportTabletPortrait);
    expect(objDevice).toEqual({ screenSize: 'tablet', orientation: 'landscape' })
    expect(objDevice_2).toEqual({ screenSize: 'tablet', orientation: 'portrait' })
  })

  test('should detect the desktop by viewport', () => {
    const viewportDesktop: any = {
      width: 1366,
      height: 667,
    }
    const viewportDesktopPortrait: any = {
      width: 1080,
      height: 1920,
    }
    const objDevice = getBreakpointFromParentClientRect(viewportDesktop);
    const objDevice_2 = getBreakpointFromParentClientRect(viewportDesktopPortrait);
    expect(objDevice).toEqual({ screenSize: 'desktop', orientation: 'landscape' })
    expect(objDevice_2).toEqual({ screenSize: 'desktop', orientation: 'portrait' })
  })
})

describe('getSpecialtiesText', () => {
  const specialties = [
    {
      "code": "SP.WCA.11",
      "label": ""
    },
    {
      "code": "SP.WCA.12",
      "label": "SP Label 12"
    }
  ]

  test('should return the right value with filter and map', () => {
    const results = getSpecialtiesText(specialties);
    expect(results).toEqual(['SP Label 12'])
  })
})

describe('applyDefaultTheme', () => {
  test('should apply default theme if dont have any instance by id __onekeysdk-defaults', () => {
    const result = applyDefaultTheme();
    expect(result).toEqual(undefined)
  })
  test('should do nothing if already had a default theme', () => {
    const styleEl = document.createElement('style');
    document.head.append(styleEl);
    expect(applyDefaultTheme()).toEqual(undefined)
  })
})

describe('getContainerHeightWidthOffset', () => {
  test('should return default offset', () => {
    const result = getContainerHeightWidthOffset();
    expect(result).toEqual({
      offsetWidth: 0,
      offsetHeight: 0,
    })
  })
  test('should return the right offset of element', () => {
    const container = document.createElement('onekey-sdk');
    document.body.append(container);
    
    //@ts-ignore
    container.offsetWidth = 1366;
    //@ts-ignore
    container.offsetHeight = 768;

    const result = getContainerHeightWidthOffset();
    expect(result).toEqual({
      offsetWidth: 1366,
      offsetHeight: 768,
    })
  })
})

describe('selectSDKElement', () => {
  test('should return null', () => {
    const dom = selectSDKElement()
    expect(dom).toEqual(null);
  })
})

describe('getCssColor', () => {
  test('should not throw an error', () => {
    const container = document.createElement('onekey-sdk');
    container.attachShadow({
      mode: 'open',
    })

    document.body.append(container);
    
    const color = getCssColor('--onekeysdk-color-dark')
    expect(color).toMatch('');
  })
})

describe('getDoctorCardOffset', () => {
  test('should now throw an error', () => {
    expect(getDoctorCardOffset(null, null)).not.toThrowError
    expect(getDoctorCardOffset(null, null, true)).not.toThrowError
    expect(getDoctorCardOffset({}, {})).not.toThrowError
    expect(getDoctorCardOffset({}, {}, true)).not.toThrowError
  })
})