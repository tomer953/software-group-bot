import { SceneContext } from 'telegraf/typings/stage';
import { TelegrafContext } from 'telegraf/typings/context';

export async function addBirthdayMiddleware(ctx: TelegrafContext, next: () => Promise<void>) {
    let scene: SceneContext<any> = (<any>ctx).scene;
    await scene.enter('birthday_wizard');
}