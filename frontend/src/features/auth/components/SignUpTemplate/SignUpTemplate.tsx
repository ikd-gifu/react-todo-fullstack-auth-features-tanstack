import { Controller } from "react-hook-form";
import { NavLink } from "react-router";

import { CommonButton } from "../../../../shared/components/ui/CommonButton";
import { InputFormValidation } from "../../../../shared/components/ui";
import { NAV_ITEMS } from "../../../../shared/constants/navigation";

import { useSignUpTemplate } from "./useSignUpTemplate";
import styles from "./style.module.css";

export const SignUpTemplate = () => {
  const { control, errors, handleSignUpSubmit } = useSignUpTemplate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>新規登録</h1>

      <form className={styles.form} onSubmit={handleSignUpSubmit}>
        <div className={styles.area}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <InputFormValidation
                inputValue={field.value}
                placeholder="name"
                handleChangeValue={field.onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />
        </div>

        <div className={styles.area}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <InputFormValidation
                type="email"
                inputValue={field.value}
                placeholder="email"
                handleChangeValue={field.onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />
        </div>

        <div className={styles.area}>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <InputFormValidation
                type="password"
                inputValue={field.value}
                placeholder="password"
                handleChangeValue={field.onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />
        </div>

        <div className={styles.area}>
          <Controller
            control={control}
            name="password_confirmation"
            render={({ field }) => (
              <InputFormValidation
                type="password"
                inputValue={field.value}
                placeholder="confirm password"
                handleChangeValue={field.onChange}
                errorMessage={errors.password_confirmation?.message}
              />
            )}
          />
        </div>

        <div className={styles.area}>
          <CommonButton type="submit">登録</CommonButton>
        </div>

        <div className={styles.link}>
          <NavLink to={NAV_ITEMS.LOGIN}>&lt;&lt; ログインはこちら</NavLink>
        </div>
      </form>
    </div>
  );
};
