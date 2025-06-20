import { test, expect, Page } from '@playwright/test'

test.describe('Korean Input Flickering Test', () => {
  let page: Page

  test.beforeEach(async ({ page: p, browserName }) => {
    page = p
    await page.goto('/')
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('.todo-input', { state: 'visible' })
  })

  test('should detect flickering during Korean input in Firefox', async ({ browserName }) => {
    test.skip(browserName !== 'firefox', 'This test is specifically for Firefox')
    
    const input = page.locator('.todo-input')
    
    // 플리킹 감지를 위한 스크린샷 비교 배열
    const screenshots: Buffer[] = []
    
    // 한글 입력 시뮬레이션
    await input.click()
    
    // 긴 한글 문장 (공백 포함 10글자 이상)
    const koreanText = '오늘은 정말 좋은 날씨입니다 감사합니다'
    
    for (let i = 0; i < koreanText.length; i++) {
      const char = koreanText[i]
      
      // 각 문자 입력 전 스크린샷
      const beforeScreenshot = await page.locator('.todo-input-form').screenshot()
      screenshots.push(beforeScreenshot)
      
      // 문자 입력
      await input.type(char, { delay: 100 })
      
      // 입력 후 짧은 대기 (렌더링 완료 대기)
      await page.waitForTimeout(50)
      
      // 각 문자 입력 후 스크린샷
      const afterScreenshot = await page.locator('.todo-input-form').screenshot()
      screenshots.push(afterScreenshot)
      
      // 추가 대기 (플리킹 감지)
      await page.waitForTimeout(100)
    }
    
    // 입력 완료 후 최종 스크린샷
    const finalScreenshot = await page.locator('.todo-input-form').screenshot()
    screenshots.push(finalScreenshot)
    
    // 입력 필드 값 확인
    const inputValue = await input.inputValue()
    expect(inputValue).toBe(koreanText)
    
    // 스크린샷들을 저장하여 육안 검증 가능하게 함
    for (let i = 0; i < screenshots.length; i++) {
      await page.screenshot({ 
        path: `test-results/korean-input-step-${i}.png`,
        fullPage: false,
        clip: { x: 0, y: 0, width: 800, height: 200 }
      })
    }
    
    console.log(`Captured ${screenshots.length} screenshots during Korean input`)
  })

  test('should measure input field stability during Korean typing', async ({ browserName }) => {
    test.skip(browserName !== 'firefox', 'This test is specifically for Firefox')
    
    const input = page.locator('.todo-input')
    await input.click()
    
    // 입력 필드의 위치와 크기 추적
    const measurements: Array<{ time: number, rect: any }> = []
    
    // 측정 시작
    const startTime = Date.now()
    
    // 한글 입력 중 지속적으로 위치/크기 측정
    const measurementInterval = setInterval(async () => {
      try {
        const rect = await input.boundingBox()
        measurements.push({
          time: Date.now() - startTime,
          rect
        })
      } catch (e) {
        // 측정 실패 시 무시
      }
    }, 20) // 20ms마다 측정
    
    // 긴 한글 입력
    await input.type('오늘은 정말 좋은 날씨입니다 감사합니다', { delay: 100 })
    
    // 측정 종료
    clearInterval(measurementInterval)
    
    // 위치/크기 변화 분석
    let positionChanges = 0
    let sizeChanges = 0
    
    for (let i = 1; i < measurements.length; i++) {
      const prev = measurements[i - 1].rect
      const curr = measurements[i].rect
      
      if (prev && curr) {
        if (prev.x !== curr.x || prev.y !== curr.y) {
          positionChanges++
        }
        if (prev.width !== curr.width || prev.height !== curr.height) {
          sizeChanges++
        }
      }
    }
    
    console.log(`Position changes: ${positionChanges}`)
    console.log(`Size changes: ${sizeChanges}`)
    console.log(`Total measurements: ${measurements.length}`)
    
    // 과도한 변화가 있으면 플리킹으로 간주
    const flickeringThreshold = measurements.length * 0.1 // 10% 이상 변화
    
    if (positionChanges > flickeringThreshold || sizeChanges > flickeringThreshold) {
      console.log('🚨 FLICKERING DETECTED!')
      console.log(`Position changes: ${positionChanges}/${measurements.length} (${(positionChanges/measurements.length*100).toFixed(1)}%)`)
      console.log(`Size changes: ${sizeChanges}/${measurements.length} (${(sizeChanges/measurements.length*100).toFixed(1)}%)`)
    } else {
      console.log('✅ No significant flickering detected')
    }
    
    // 결과를 파일로 저장
    const results = {
      browser: browserName,
      totalMeasurements: measurements.length,
      positionChanges,
      sizeChanges,
      flickeringDetected: positionChanges > flickeringThreshold || sizeChanges > flickeringThreshold,
      measurements: measurements.slice(0, 10) // 처음 10개만 저장
    }
    
    await page.evaluate((data) => {
      console.log('Flickering Test Results:', JSON.stringify(data, null, 2))
    }, results)
  })

  test('should compare Korean input behavior between browsers', async ({ browserName }) => {
    const input = page.locator('.todo-input')
    await input.click()
    
    // 입력 이벤트 로깅
    await page.evaluate(() => {
      const input = document.querySelector('.todo-input') as HTMLInputElement
      if (input) {
        const events: string[] = []
        
        ['input', 'compositionstart', 'compositionupdate', 'compositionend', 'keydown', 'keyup'].forEach(eventType => {
          input.addEventListener(eventType, (e) => {
            events.push(`${Date.now()}: ${eventType} - ${(e as any).data || (e as any).key || ''}`)
            console.log(`${eventType}:`, e)
          })
        })
        
        // @ts-ignore
        window.inputEvents = events
      }
    })
    
    // 긴 한글 입력
    await input.type('오늘은 정말 좋은 날씨입니다', { delay: 80 })
    
    // 이벤트 로그 수집
    const events = await page.evaluate(() => {
      // @ts-ignore
      return window.inputEvents || []
    })
    
    console.log(`\n=== ${browserName.toUpperCase()} INPUT EVENTS ===`)
    events.forEach((event: string) => console.log(event))
    console.log(`Total events: ${events.length}`)
    
    // 입력 완료 확인
    const finalValue = await input.inputValue()
    expect(finalValue).toBe('오늘은 정말 좋은 날씨입니다')
  })

  test('should test very long Korean text input for flickering', async ({ browserName }) => {
    test.skip(browserName !== 'firefox', 'This test is specifically for Firefox')
    
    const input = page.locator('.todo-input')
    await input.click()
    
    // 매우 긴 한글 텍스트 (20글자 이상)
    const longText = '안녕하세요 오늘은 정말 좋은 날씨입니다 감사합니다 행복하세요'
    
    console.log(`Testing with long text: "${longText}" (${longText.length} characters)`)
    
    // 입력 필드의 위치와 크기 지속적 추적
    const measurements: Array<{ time: number, rect: any, textLength: number }> = []
    
    const startTime = Date.now()
    
    // 더 높은 빈도로 측정 (10ms마다)
    const measurementInterval = setInterval(async () => {
      try {
        const rect = await input.boundingBox()
        const currentValue = await input.inputValue()
        measurements.push({
          time: Date.now() - startTime,
          rect,
          textLength: currentValue.length
        })
      } catch (e) {
        // 측정 실패 시 무시
      }
    }, 10)
    
    // 천천히 입력하여 변화 포착
    await input.type(longText, { delay: 120 })
    
    // 측정 종료
    clearInterval(measurementInterval)
    
    // 상세 분석
    let positionChanges = 0
    let sizeChanges = 0
    let significantChanges = 0
    
    for (let i = 1; i < measurements.length; i++) {
      const prev = measurements[i - 1]
      const curr = measurements[i]
      
      if (prev.rect && curr.rect) {
        const posChanged = prev.rect.x !== curr.rect.x || prev.rect.y !== curr.rect.y
        const sizeChanged = prev.rect.width !== curr.rect.width || prev.rect.height !== curr.rect.height
        
        if (posChanged) positionChanges++
        if (sizeChanged) sizeChanges++
        
        // 1px 이상의 변화를 유의미한 변화로 간주
        const significantPosChange = Math.abs(prev.rect.x - curr.rect.x) > 1 || Math.abs(prev.rect.y - curr.rect.y) > 1
        const significantSizeChange = Math.abs(prev.rect.width - curr.rect.width) > 1 || Math.abs(prev.rect.height - curr.rect.height) > 1
        
        if (significantPosChange || significantSizeChange) {
          significantChanges++
          console.log(`Significant change at ${curr.time}ms: pos(${prev.rect.x},${prev.rect.y}) -> (${curr.rect.x},${curr.rect.y}), size(${prev.rect.width}x${prev.rect.height}) -> (${curr.rect.width}x${curr.rect.height})`)
        }
      }
    }
    
    console.log(`\n=== LONG TEXT FLICKERING ANALYSIS ===`)
    console.log(`Text length: ${longText.length} characters`)
    console.log(`Total measurements: ${measurements.length}`)
    console.log(`Position changes: ${positionChanges}`)
    console.log(`Size changes: ${sizeChanges}`)
    console.log(`Significant changes: ${significantChanges}`)
    console.log(`Change rate: ${(significantChanges/measurements.length*100).toFixed(1)}%`)
    
    // 플리킹 임계값을 더 엄격하게 설정
    const strictThreshold = measurements.length * 0.05 // 5% 이상 변화
    
    if (significantChanges > strictThreshold) {
      console.log('🚨 SEVERE FLICKERING DETECTED with long text!')
      console.log(`Significant changes: ${significantChanges}/${measurements.length} (${(significantChanges/measurements.length*100).toFixed(1)}%)`)
      
      // 상세 분석 결과를 파일로 저장
      await page.evaluate((data) => {
        console.error('FLICKERING DETECTED:', JSON.stringify(data, null, 2))
      }, {
        textLength: longText.length,
        totalMeasurements: measurements.length,
        significantChanges,
        changeRate: significantChanges/measurements.length*100,
        flickeringDetected: true
      })
    } else {
      console.log('✅ Long text input is stable')
    }
    
    // 최종 입력 확인
    const finalValue = await input.inputValue()
    expect(finalValue).toBe(longText)
  })
})