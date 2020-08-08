import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowUserPage } from './show-user.page';

describe('ShowUserPage', () => {
  let component: ShowUserPage;
  let fixture: ComponentFixture<ShowUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowUserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
