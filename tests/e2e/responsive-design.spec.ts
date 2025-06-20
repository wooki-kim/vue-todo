import { test, expect } from '@playwright/test'

test.describe('반응형 디자인 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('아이폰 미니 (375x667) 해상도에서 UI가 정상 동작', async ({ page }) => {
    // 아이폰 미니 해상도 설정
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 제목이 보이는지 확인
    const title = page.getByRole('heading', { name: '할 일 목록' })
    await expect(title).toBeVisible()
    
    // 입력창이 보이는지 확인
    const input = page.getByPlaceholder('할 일을 입력하세요...')
    await expect(input).toBeVisible()
    
    // 우선순위 선택박스가 보이는지 확인
    const prioritySelect = page.locator('.priority-select')
    await expect(prioritySelect).toBeVisible()
    
    // 할 일 추가 테스트
    await input.fill('아이폰 미니에서 테스트')
    await input.press('Enter')
    
    // 추가된 할 일이 보이는지 확인
    const todoItem = page.getByText('아이폰 미니에서 테스트')
    await expect(todoItem).toBeVisible()
    
    // 푸터 버튼들이 보이는지 확인
    const completeButton = page.getByText('완료')
    await expect(completeButton).toBeVisible()
    
    // 가로 스크롤이 없는지 확인
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const windowInnerWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyScrollWidth).toBeLessThanOrEqual(windowInnerWidth)
  })

  test('매우 작은 화면 (320x568)에서도 UI가 깨지지 않음', async ({ page }) => {
    // 매우 작은 해상도 설정
    await page.setViewportSize({ width: 320, height: 568 })
    
    // 할 일 추가
    const input = page.getByPlaceholder('할 일을 입력하세요...')
    await input.fill('아주 긴 할 일 제목으로 테스트해보는 내용입니다. 이 텍스트가 화면을 넘어가지 않아야 합니다.')
    await input.press('Enter')
    
    // 텍스트가 화면을 벗어나지 않는지 확인
    const todoText = page.locator('.todo-text').first()
    const todoBox = await todoText.boundingBox()
    expect(todoBox?.x).toBeGreaterThanOrEqual(0)
    expect(todoBox?.x! + todoBox?.width!).toBeLessThanOrEqual(320)
    
    // 가로 스크롤이 없는지 확인
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyScrollWidth).toBeLessThanOrEqual(320)
  })

  test('태블릿 (768x1024) 해상도에서 UI가 정상 동작', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // 컨테이너가 중앙 정렬되는지 확인
    const todoApp = page.locator('.todo-app')
    const appBox = await todoApp.boundingBox()
    const expectedLeftMargin = (768 - 520) / 2 // max-width: 520px
    expect(appBox?.x).toBeCloseTo(expectedLeftMargin, 10)
    
    // 할 일 추가
    const input = page.getByPlaceholder('할 일을 입력하세요...')
    await input.fill('태블릿에서 테스트')
    await input.press('Enter')
    
    // 푸터 레이아웃이 가로로 배치되는지 확인
    const footerContent = page.locator('.footer-content')
    const isRowLayout = await footerContent.evaluate(el => 
      getComputedStyle(el).flexDirection === 'row'
    )
    expect(isRowLayout).toBe(true)
  })

  test('데스크탑 (1920x1080) 해상도에서 UI가 정상 동작', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // 컨테이너가 최대 너비로 제한되고 중앙 정렬되는지 확인
    const todoApp = page.locator('.todo-app')
    const appBox = await todoApp.boundingBox()
    expect(appBox?.width).toBeLessThanOrEqual(800) // max-width: 800px
    
    const expectedLeftMargin = (1920 - 800) / 2
    expect(appBox?.x).toBeCloseTo(expectedLeftMargin, 10)
    
    // 긴 텍스트 테스트
    const input = page.getByPlaceholder('할 일을 입력하세요...')
    const longText = '이것은 매우 긴 할 일 제목입니다. 데스크탑에서는 이 텍스트가 말줄임으로 처리되어야 하고, 마우스를 올리면 전체 내용을 볼 수 있어야 합니다.'
    await input.fill(longText)
    await input.press('Enter')
    
    // 텍스트가 말줄임 처리되는지 확인
    const todoText = page.locator('.todo-text').first()
    const isEllipsisApplied = await todoText.evaluate(el => {
      const style = getComputedStyle(el)
      return style.textOverflow === 'ellipsis' && 
             style.overflow === 'hidden' && 
             style.whiteSpace === 'nowrap'
    })
    expect(isEllipsisApplied).toBe(true)
  })

  test('다양한 해상도에서 푸터 버튼이 올바르게 배치됨', async ({ page }) => {
    // 할 일을 몇 개 추가해서 모든 버튼이 나오도록 함
    await page.getByPlaceholder('할 일을 입력하세요...').fill('첫 번째 할 일')
    await page.press('input', 'Enter')
    
    await page.getByPlaceholder('할 일을 입력하세요...').fill('두 번째 할 일')
    await page.press('input', 'Enter')
    
    // 첫 번째 할 일 완료 처리
    await page.locator('.toggle').first().check()
    
    // 아이폰 미니에서 버튼 배치 확인
    await page.setViewportSize({ width: 375, height: 667 })
    
    const actions = page.locator('.actions')
    const filters = page.locator('.filters')
    
    // 아이폰 미니에서는 버튼이 위에, 필터가 아래에
    const actionsBox = await actions.boundingBox()
    const filtersBox = await filters.boundingBox()
    expect(actionsBox?.y).toBeLessThan(filtersBox?.y!)
    
    // 데스크탑에서 버튼 배치 확인
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    const actionsBoxDesktop = await actions.boundingBox()
    const filtersBoxDesktop = await filters.boundingBox()
    
    // 데스크탑에서는 같은 줄에 배치
    expect(Math.abs(actionsBoxDesktop?.y! - filtersBoxDesktop?.y!)).toBeLessThan(10)
  })

  test('모든 해상도에서 터치 대상 크기가 적절함', async ({ page }) => {
    const resolutions = [
      { width: 320, height: 568 },  // 매우 작은 화면
      { width: 375, height: 667 },  // 아이폰 미니
      { width: 768, height: 1024 }, // 태블릿
      { width: 1920, height: 1080 } // 데스크탑
    ]
    
    // 할 일 추가
    await page.getByPlaceholder('할 일을 입력하세요...').fill('터치 테스트')
    await page.press('input', 'Enter')
    
    for (const resolution of resolutions) {
      await page.setViewportSize(resolution)
      
      // 체크박스 크기 확인 (최소 44x44px 권장)
      const toggle = page.locator('.toggle').first()
      const toggleBox = await toggle.boundingBox()
      const minTouchSize = resolution.width <= 375 ? 32 : 44 // 작은 화면에서는 조금 작게
      
      expect(toggleBox?.width).toBeGreaterThanOrEqual(minTouchSize - 16) // 패딩 고려
      expect(toggleBox?.height).toBeGreaterThanOrEqual(minTouchSize - 16)
      
      // 버튼들의 터치 영역 확인
      const buttons = ['.toggle-all-button', '.clear-completed', '.clear-all']
      for (const buttonSelector of buttons) {
        const button = page.locator(buttonSelector)
        if (await button.isVisible()) {
          const buttonBox = await button.boundingBox()
          const minButtonSize = resolution.width <= 375 ? 28 : 36
          
          expect(buttonBox?.height).toBeGreaterThanOrEqual(minButtonSize)
        }
      }
    }
  })
})