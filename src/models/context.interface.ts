import { Context, Scenes } from 'telegraf';
import { User } from './user.model';

/**
 * We can define our own context object.
 *
 * We have to set the scene object under the `scene` property. As we're using
 * wizards, we have to pass `WizardSessionData` to the scene object.
 *
 * We also have to set the wizard object under the `wizard` property.
 */
export interface CustomContext extends Context {
  // will be available under `ctx.user \ ctx.isAdmin`
  user: User;
  isAdmin: boolean;
  
  // declare scene type
  scene: Scenes.SceneContextScene<CustomContext, Scenes.WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<CustomContext>;
}
